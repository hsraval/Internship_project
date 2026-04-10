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

    // const totalRevenue = bills.reduce((sum, b) => sum + b.totalAmount, 0);
    const paidRevenue = bills.reduce((sum, b) => {
      return b.paymentStatus === "paid" ? sum + (b.totalAmount || 0) : sum;
    }, 0);

    const pendingRevenue = bills.reduce((sum, b) => {
      return b.paymentStatus === "pending" ? sum + (b.totalAmount || 0) : sum;
    }, 0);

    const totalRevenue = paidRevenue + pendingRevenue;

    res.status(200).json({
      success: true,
      data: {
        month,
        year,
        totalRevenue,
        pendingRevenue,
        paidRevenue
      }
    });

  } catch (err) {
    next(err);
  }
};

// ================= DOWNLOAD PDF =================

// exports.downloadRevenuePDF = async (req, res, next) => {
//   try {
//     let { month, year } = req.query;

//     month = Number(month);
//     year = Number(year);

//     if (!month || !year) {
//       return res.status(400).json({
//         success: false,
//         message: "Month and Year required"
//       });
//     }

//     const start = new Date(year, month - 1, 1);
//     const end = new Date(year, month, 1);

//     const bills = await Bill.find({
//       createdAt: { $gte: start, $lt: end }
//     }).populate("user", "name")
//        .populate("items.product", "name"); // This is added..

//     const doc = new PDFDocument({ margin: 40 });

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=Revenue_${month}_${year}.pdf`
//     );

//     doc.pipe(res);

//     const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

//     // HEADER
//     doc.fontSize(20).text("LarkingsMensWear", { align: "center" });
//     doc.moveDown();
//     doc.fontSize(14).text(`Revenue Report - ${monthNames[month - 1]} ${year}`, { align: "center" });

//     doc.moveDown(2);

//     // 🔥 TABLE HEADER
//     let y = doc.y;

//     doc.fontSize(12).text("Customer", 50, y);
//     doc.text("Item", 200, y);
//     doc.text("Amount", 400, y);

//     y += 20;

//     let totalRevenue = 0;

//     // 🔥 FIXED LOOP (MULTI-ITEM SAFE)
//     bills.forEach((bill) => {
//       bill.items.forEach((item) => {
//         doc
//           .fontSize(10)
//           .text(bill.user?.name || "N/A", 50, y)
//           .text(item.name || "N/A", 200, y)
//           .text(`₹${item.total || 0}`, 400, y);

//         totalRevenue += item.total || 0;

//         y += 20;

//         // Page break safety
//         if (y > 750) {
//           doc.addPage();
//           y = 50;
//         }
//       });
//     });

//     doc.moveDown(2);

//     doc.fontSize(14).text(`Total Revenue: ₹${totalRevenue}`, {
//       align: "right"
//     });

//     doc.end();

//   } catch (err) {
//     next(err);
//   }
// };

// ========================

exports.downloadRevenuePDF = async (req, res, next) => {
  try {
    let { month, year } = req.query;
    month = Number(month);
    year = Number(year);

    if (!month || !year) {
      return res.status(400).json({ success: false, message: "Month and Year required" });
    }

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const bills = await Bill.find({
      createdAt: { $gte: start, $lt: end }
    }).populate("user", "name")
       // Uncomment below if you need product details
       // .populate("items.product", "name");

    const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=Revenue_${month}_${year}.pdf`);

    doc.pipe(res);

    // --- COLORS & CONFIG ---
    const colors = {
      primary: '#2c3e50',   // Dark Blue
      secondary: '#3498db', // Bright Blue
      accent: '#e67e22',    // Orange
      success: '#27ae60',   // Green
      text: '#333333',
      light: '#f9f9f9',
      border: '#dddddd'
    };

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // --- 1. HEADER SECTION ---
    // Background Header
    doc.rect(0, 0, doc.page.width, 80).fill(colors.primary);
    
    // Shop Name
    doc.fillColor('#ffffff').fontSize(28).font('Helvetica-Bold').text("LARKINGS MENSWEAR", 50, 25);
    
    // Report Title Badge
    const dateStr = `${monthNames[month - 1]} ${year}`;
    doc.roundedRect(400, 20, 145, 40, 5).fill(colors.accent);
    doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text(dateStr, 472.5, 35, { align: 'center' });

    doc.moveDown(3);

    // --- 2. STATISTICS CARDS ---
    const cardY = doc.y;
    
    // Calculate stats
    const totalOrders = bills.length;
    const totalItems = bills.reduce((acc, b) => acc + b.items.length, 0);
    const totalRevenue = bills.reduce((sum, bill) => 
      sum + bill.items.reduce((itemSum, item) => itemSum + (item.total || 0), 0), 0
    );

    // Helper for cards
    const drawCard = (x, y, label, value, color, isCurrency = false) => {
      // Card Border
      doc.roundedRect(x, y, 160, 70, 5).lineWidth(1).strokeColor(colors.border).fillAndStroke('#fff', colors.border);
      // Color Strip on Left
      doc.rect(x, y, 6, 70).fill(color).stroke();
      
      // Text
      doc.fillColor('#777').fontSize(10).font('Helvetica').text(label, x + 15, y + 12);
      
      doc.fillColor(colors.text).fontSize(20).font('Helvetica-Bold');
      if (isCurrency) {
        // Just the number, no symbol
        doc.text(`${Number(value).toFixed(2)}`, x + 15, y + 32);
      } else {
        doc.text(value, x + 15, y + 32);
      }
    };

    drawCard(50, cardY, "TOTAL ORDERS", totalOrders, colors.secondary);
    drawCard(220, cardY, "TOTAL ITEMS", totalItems, colors.success);
    drawCard(390, cardY, "GROSS REVENUE", totalRevenue, colors.primary, true);

    doc.moveDown(3.5);

    // --- 3. MODERN TABLE ---
    const tableTop = doc.y;
    const rowHeight = 28;
    const colX = { cust: 55, item: 200, amt: 450 };
    let currentY = tableTop;

    // Table Header
    doc.rect(50, currentY, 495, 32).fill(colors.primary);
    doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold');
    doc.text("CUSTOMER NAME", colX.cust, currentY + 10, { width: 130 });
    doc.text("PRODUCT / ITEM", colX.item, currentY + 10);
    doc.text("AMOUNT(Rupee)", colX.amt, currentY + 10, { width: 90, align: 'right' });

    currentY += 32;

    // Rows
    let rowCount = 0;
    
    bills.forEach((bill) => {
      bill.items.forEach((item) => {
        if (currentY > 720) {
          doc.addPage();
          currentY = 50;
          // Header on new page
          doc.rect(50, currentY, 495, 32).fill(colors.primary);
          doc.fillColor('#ffffff').fontSize(11).font('Helvetica-Bold');
          doc.text("CUSTOMER NAME", colX.cust, currentY + 10, { width: 130 });
          doc.text("PRODUCT / ITEM", colX.item, currentY + 10);
          doc.text("AMOUNT(Rupee)", colX.amt, currentY + 10, { width: 90, align: 'right' });
          currentY += 32;
        }

        // Row Background
        if (rowCount % 2 === 0) {
          doc.rect(50, currentY, 495, rowHeight).fill('#f8f9fa');
        }

        // Text
        doc.fillColor('#333').fontSize(10).font('Helvetica');
        doc.text(bill.user?.name || "Walk-in Customer", colX.cust, currentY + 8, { width: 130 });
        doc.text(item.name || "General Item", colX.item, currentY + 8);
        
        // Amount (No Symbol)
        const amt = Number(item.total || 0).toFixed(2);
        doc.text(amt, colX.amt, currentY + 8, { width: 90, align: 'right' });

        currentY += rowHeight;
        rowCount++;
      });
    });

    // --- 4. SUMMARY FOOTER BOX ---
    const summaryY = currentY + 20;
    doc.rect(50, summaryY, 495, 50).fill(colors.light).stroke(colors.border);
    
    doc.fillColor(colors.primary).fontSize(12).font('Helvetica-Bold').text("TOTAL REVENUE THIS MONTH", 70, summaryY + 18);
    
    // Big Total (No Symbol)
    const totalStr = `${Number(totalRevenue).toFixed(2)}`;
    doc.fillColor(colors.primary).fontSize(22).font('Helvetica-Bold').text(totalStr, 350, summaryY + 15);

    // --- 5. PAGE FOOTER ---
    const range = doc.bufferedPageRange();
    for (let i = range.start; i <= range.end; i++) {
      doc.switchToPage(i);
      doc.fontSize(9).fillColor('#999').font('Helvetica-Oblique')
        .text(`Generated by Larkings System | Page ${i + 1} of ${range.count}`, 50, doc.page.height - 30, { align: 'center' });
    }

    doc.end();

  } catch (err) {
    console.error("Revenue PDF Error:", err);
    next(err);
  }
};