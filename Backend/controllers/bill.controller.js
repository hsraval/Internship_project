const mongoose = require('mongoose');
const Bill = require('../models/bill.model');
const PDFDocument = require('pdfkit');

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

exports.downloadBillPDF = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Bill ID"
            });
        }

        const bill = await Bill.findById(id).lean();

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

        doc.fontSize(18).text('INVOICE', { align: 'center' });

        doc.moveDown();
        doc.fontSize(12).text(`Invoice: ${bill.invoiceNumber}`);
        doc.text(`Date: ${new Date(bill.createdAt).toDateString()}`);

        doc.moveDown();
        doc.text(`Customer: ${bill.billingAddress?.name || ''}`);
        doc.text(`Phone: ${bill.billingAddress?.phone || ''}`);

        doc.moveDown();
        doc.text(`Payment Status: ${bill.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}`);

        doc.moveDown(2);

        bill.items.forEach((item, i) => {
            doc.text(
                `${i + 1}. ${item.name} | ${item.quantity} x ₹${item.price} = ₹${item.total}`
            );
        });

        doc.moveDown();
        doc.text(`Subtotal: ₹${bill.subtotal || 0}`);
        doc.text(`Tax: ₹${bill.tax || 0}`);
        doc.text(`Discount: ₹${bill.discount || 0}`);
        doc.text(`Total: ₹${bill.totalAmount}`);

        doc.end();

    } catch (err) {
        next(err);
    }
};