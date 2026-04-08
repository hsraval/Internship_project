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

        const bill = await Bill.findOne({order: id})
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
// exports.downloadBillPDF = async (req, res, next) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Bill ID"
//             });
//         }

//         const bill = await Bill.findById(id)
//             .populate('user', 'name')
//             .lean();

//         if (!bill) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Bill not found"
//             });
//         }

//         const doc = new PDFDocument();

//         res.setHeader('Content-Type', 'application/pdf');
//         res.setHeader(
//             'Content-Disposition',
//             `attachment; filename=${bill.invoiceNumber}.pdf`
//         );

//         doc.pipe(res);

//         // 🔹 HEADER
//         doc.fontSize(18).text('INVOICE', { align: 'center' });

//         doc.moveDown();
//         doc.fontSize(12).text(`Invoice: ${bill.invoiceNumber}`);
//         doc.text(`Date: ${new Date(bill.createdAt).toDateString()}`);

//         doc.moveDown();
//         doc.text(`Customer: ${bill.user?.name || 'N/A'}`);

//         doc.moveDown();
//         doc.text(`Payment Status: ${bill.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}`);

//         doc.moveDown(2);

//         // 🔹 ITEMS
//         bill.items.forEach((item, i) => {
//             doc.text(
//                 `${i + 1}. ${item.name} | ${item.quantity} x ₹${item.price} = ₹${item.total}`
//             );
//         });

//         doc.moveDown();
//         doc.text(`Tax: ₹${bill.tax || 0}`);
//         doc.text(`Discount: ₹${bill.discount || 0}`);
//         doc.text(`Total: ₹${bill.totalAmount}`);

//         // 🔥 🔹 QR CODE GENERATION
//         const upiUrl = `upi://pay?pa=kashyapgaliya295@okhdfcbank@bank&pn=Your Store&am=${bill.totalAmount}&cu=INR&tn=${bill.invoiceNumber}`;

//         const qrImage = await QRCode.toDataURL(upiUrl);

//         const qrBuffer = Buffer.from(qrImage.split(',')[1], 'base64');

//         doc.moveDown(2);
//         doc.text("Scan to Pay", { align: 'center' });

//         doc.image(qrBuffer, {
//             fit: [150, 150],
//             align: 'center'
//         });

//         doc.end();

//     } catch (err) {
//         next(err);
//     }
// };

exports.downloadBillPDF = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Bill ID"
            });
        }

        const bill = await Bill.findOne({order:id})
            .populate('user', 'name email')
            .lean();

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "Bill not found"
            });
        }

        const doc = new PDFDocument({ margin: 40 });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=${bill.invoiceNumber}.pdf`
        );

        doc.pipe(res);

        // ================= HEADER =================
        doc
            .fontSize(22)
            .fillColor('#161711')
            .text('LarkingsMensWear', { align: 'left' });

        doc
            .fontSize(10)
            .fillColor('gray')
            .text('Premium Tailoring & Fabrics', { align: 'left' });

        doc.moveUp(2);

        doc
            .fontSize(20)
            .fillColor('#45362C')
            .text('INVOICE', { align: 'right' });

        doc.moveDown();

        // ================= INFO =================
        doc
            .fontSize(10)
            .fillColor('#000')
            .text(`Invoice No: ${bill.invoiceNumber}`)
            .text(`Date: ${new Date(bill.createdAt).toDateString()}`)
            .text(`Customer: ${bill.user?.name || 'N/A'}`)
            .text(`Email: ${bill.user?.email || 'N/A'}`);

        doc.moveDown();

        // ================= STATUS =================
        doc
            .fontSize(12)
            .fillColor(bill.paymentStatus === 'paid' ? 'green' : 'red')
            .text(
                `Payment Status: ${
                    bill.paymentStatus === 'paid' ? 'PAID' : 'PENDING'
                }`
            );

        doc.moveDown(2);

        // ================= TABLE HEADER =================
        const tableTop = doc.y;

        doc
            .fontSize(11)
            .fillColor('#A8977A')
            .text('Item', 50, tableTop)
            .text('Qty', 250, tableTop)
            .text('Price', 300, tableTop)
            .text('Total', 400, tableTop);

        doc.moveDown();

        // ================= ITEMS =================
        let y = doc.y;

        bill.items.forEach((item) => {
            doc
                .fontSize(10)
                .fillColor('#000')
                .text(item.name, 50, y)
                .text(item.quantity, 250, y)
                .text(`₹${item.price}`, 300, y)
                .text(`₹${item.total}`, 400, y);

            y += 20;
        });

        doc.moveDown(2);

        // ================= TOTAL SECTION =================
        doc
            .fontSize(11)
            .text(`Tax: ₹${bill.tax || 0}`, { align: 'right' })
            .text(`Discount: ₹${bill.discount || 0}`, { align: 'right' });

        doc.moveDown();

        doc
            .fontSize(14)
            .fillColor('#45362C')
            .text(`Total Amount: ₹${bill.totalAmount}`, { align: 'right' });

        doc.moveDown(2);

        // ================= QR CODE =================
        const upiUrl = `upi://pay?pa=kashyapgaliya295@okhdfcbank@bank&pn=LarkingsMensWear&am=${bill.totalAmount}&cu=INR&tn=${bill.invoiceNumber}`;

        const qrImage = await QRCode.toDataURL(upiUrl);
        const qrBuffer = Buffer.from(qrImage.split(',')[1], 'base64');

        doc
            .fontSize(10)
            .fillColor('#000')
            .text("Scan to Pay", { align: 'center' });

        doc.image(qrBuffer, {
            fit: [120, 120],
            align: 'center'
        });

        doc.moveDown(2);

        // ================= FOOTER =================
        doc
            .fontSize(10)
            .fillColor('gray')
            .text(
                'Thank you for choosing LarkingsMensWear!',
                { align: 'center' }
            );

        doc.text(
            'We provide premium tailoring and fabric services.',
            { align: 'center' }
        );

        doc.end();

    } catch (err) {
        next(err);
    }
};