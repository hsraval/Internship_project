const mongoose = require('mongoose');
const Bill = require('../models/bill.model');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode'); // ✅ ADDED

// 🔹 Get all bills (Admin)
exports.getBills = async (req, res, next) => {
    try {
        let { page = 1, limit = 10 } = req.query;

        page = Number(page);
        limit = Number(limit);

        if (page < 1 || limit < 1) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination values"
            });
        }

        const skip = (page - 1) * limit;

        const bills = await Bill.find()
            .populate('user', 'name email')
            .populate('order')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean();

        const total = await Bill.countDocuments();

        return res.status(200).json({
            success: true,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: bills
        });

    } catch (err) {
        next(err);
    }
};

// 🔹 Get single bill
exports.getSingleBill = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Bill ID"
            });
        }

        const bill = await Bill.findById(id)
            .populate('user', 'name email')
            .populate('order')
            .lean();

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "Bill not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: bill
        });

    } catch (err) {
        next(err);
    }
};

// 🔹 Download Bill PDF (WITH QR CODE)
exports.downloadBillPDF = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Bill ID"
            });
        }

        const bill = await Bill.findById(id)
            .populate('user', 'name')
            .lean();

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "Bill not found"
            });
        }

        const doc = new PDFDocument();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=${bill.invoiceNumber}.pdf`
        );

        doc.pipe(res);

        // 🔹 HEADER
        doc.fontSize(18).text('INVOICE', { align: 'center' });

        doc.moveDown();
        doc.fontSize(12).text(`Invoice: ${bill.invoiceNumber}`);
        doc.text(`Date: ${new Date(bill.createdAt).toDateString()}`);

        doc.moveDown();
        doc.text(`Customer: ${bill.user?.name || 'N/A'}`);

        doc.moveDown();
        doc.text(`Payment Status: ${bill.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}`);

        doc.moveDown(2);

        // 🔹 ITEMS
        bill.items.forEach((item, i) => {
            doc.text(
                `${i + 1}. ${item.name} | ${item.quantity} x ₹${item.price} = ₹${item.total}`
            );
        });

        doc.moveDown();
        doc.text(`Tax: ₹${bill.tax || 0}`);
        doc.text(`Discount: ₹${bill.discount || 0}`);
        doc.text(`Total: ₹${bill.totalAmount}`);

        // 🔥 🔹 QR CODE GENERATION
        const upiUrl = `upi://pay?pa=kashyapgaliya295@okhdfcbank@bank&pn=Your Store&am=${bill.totalAmount}&cu=INR&tn=${bill.invoiceNumber}`;

        const qrImage = await QRCode.toDataURL(upiUrl);

        const qrBuffer = Buffer.from(qrImage.split(',')[1], 'base64');

        doc.moveDown(2);
        doc.text("Scan to Pay", { align: 'center' });

        doc.image(qrBuffer, {
            fit: [150, 150],
            align: 'center'
        });

        doc.end();

    } catch (err) {
        next(err);
    }
};