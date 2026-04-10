const Order = require("../models/order.model");
const Product = require("../models/product.model");
const User = require("../models/user.model");
const Bill = require("../models/bill.model");
const PDFDocument = require("pdfkit");

// ================= DASHBOARD =================

exports.getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalUsers,
      totalProducts,
      totalFabrics
    ] = await Promise.all([
      Order.countDocuments({ isDeleted: false }),
      Order.countDocuments({ status: "pending" }),
      Order.countDocuments({ status: "delivered" }),
      User.countDocuments(),
      Product.countDocuments({ productType: "product", isDeleted: false }),
      Product.countDocuments({ productType: "fabric", isDeleted: false })
    ]);

    // 🔥 Revenue
    const revenueData = await Bill.aggregate([
      {
        $group: {
          _id: "$paymentStatus",
          total: { $sum: "$totalAmount" }
        }
      }
    ]);

    let paidRevenue = 0;
    let pendingRevenue = 0;

    revenueData.forEach(r => {
      if (r._id === "paid") paidRevenue = r.total;
      if (r._id === "pending") pendingRevenue = r.total;
    });

    const totalRevenue = paidRevenue + pendingRevenue;

    // 🔥 Monthly Revenue
    const monthlyRevenue = await Bill.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const formattedMonthly = monthlyRevenue.map(m => ({
      month: monthNames[m._id - 1],
      revenue: m.revenue
    }));

    // 🔥 Recent Orders
    const recentOrders = await Order.find()
      .populate("userId", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    // 🔥 Order Status Stats
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalOrders,
          pendingOrders,
          deliveredOrders,
          totalUsers,
          totalProducts,
          totalFabrics
        },
        revenue: {
          totalRevenue,
          paidRevenue,
          pendingRevenue
        },
        monthlyRevenue: formattedMonthly,
        recentOrders,
        orderStatusStats
      }
    });

  } catch (err) {
    next(err);
  }
};

// ================= MONTHLY REVENUE =================

exports.getMonthlyRevenue = async (req, res, next) => {
  try {
    let { month, year } = req.query;

    month = Number(month);
    year = Number(year);

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and Year required"
      });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const bills = await Bill.find({
      createdAt: { $gte: start, $lt: end }
    }).populate("user", "name");

    const totalRevenue = bills.reduce((sum, b) => sum + b.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        month,
        year,
        totalRevenue
      }
    });

  } catch (err) {
    next(err);
  }
};

// ================= DOWNLOAD PDF =================

exports.downloadRevenuePDF = async (req, res, next) => {
  try {
    let { month, year } = req.query;

    month = Number(month);
    year = Number(year);

    if (!month || !year) {
      return res.status(400).json({
        success: false,
        message: "Month and Year required"
      });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const bills = await Bill.find({
      createdAt: { $gte: start, $lt: end }
    }).populate("user", "name")
       .populate("items.product", "name"); // This is added..

    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Revenue_${month}_${year}.pdf`
    );

    doc.pipe(res);

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // HEADER
    doc.fontSize(20).text("LarkingsMensWear", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Revenue Report - ${monthNames[month - 1]} ${year}`, { align: "center" });

    doc.moveDown(2);

    // 🔥 TABLE HEADER
    let y = doc.y;

    doc.fontSize(12).text("Customer", 50, y);
    doc.text("Item", 200, y);
    doc.text("Amount", 400, y);

    y += 20;

    let totalRevenue = 0;

    // 🔥 FIXED LOOP (MULTI-ITEM SAFE)
    bills.forEach((bill) => {
      bill.items.forEach((item) => {
        doc
          .fontSize(10)
          .text(bill.user?.name || "N/A", 50, y)
          .text(item.name || "N/A", 200, y)
          .text(`₹${item.total || 0}`, 400, y);

        totalRevenue += item.total || 0;

        y += 20;

        // Page break safety
        if (y > 750) {
          doc.addPage();
          y = 50;
        }
      });
    });

    doc.moveDown(2);

    doc.fontSize(14).text(`Total Revenue: ₹${totalRevenue}`, {
      align: "right"
    });

    doc.end();

  } catch (err) {
    next(err);
  }
};