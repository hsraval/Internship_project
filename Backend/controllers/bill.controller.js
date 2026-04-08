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

// exports.downloadBillPDF = async (req, res, next) => {
//     try {
//         const { id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(id)) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Invalid Bill ID"
//             });
//         }

//         const bill = await Bill.findById(id).lean();

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

//         doc.fontSize(18).text('INVOICE', { align: 'center' });

//         doc.moveDown();
//         doc.fontSize(12).text(`Invoice: ${bill.invoiceNumber}`);
//         doc.text(`Date: ${new Date(bill.createdAt).toDateString()}`);

//         doc.moveDown();
//         doc.text(`Customer: ${bill.billingAddress?.name || ''}`);
//         doc.text(`Phone: ${bill.billingAddress?.phone || ''}`);

//         doc.moveDown();
//         doc.text(`Payment Status: ${bill.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}`);

//         doc.moveDown(2);

//         bill.items.forEach((item, i) => {
//             doc.text(
//                 `${i + 1}. ${item.name} | ${item.quantity} x ₹${item.price} = ₹${item.total}`
//             );
//         });

//         doc.moveDown();
//         doc.text(`Subtotal: ₹${bill.subtotal || 0}`);
//         doc.text(`Tax: ₹${bill.tax || 0}`);
//         doc.text(`Discount: ₹${bill.discount || 0}`);
//         doc.text(`Total: ₹${bill.totalAmount}`);

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

        const bill = await Bill.findById(id)
            .populate('user', 'name email phone address') // Populating more fields for better address display
            .lean();

        if (!bill) {
            return res.status(404).json({
                success: false,
                message: "Bill not found"
            });
        }

        const doc = new PDFDocument({
            margin: 50,
            size: 'A4',
            info: {
                Title: `Invoice ${bill.invoiceNumber}`,
                Author: 'Your Tailor Shop Name',
            }
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="Invoice_${bill.invoiceNumber}.pdf"`
        );

        doc.pipe(res);

        // --- CONFIGURATION ---
        const primaryColor = '#2c3e50'; // Dark Blue/Grey
        const accentColor = '#e67e22';  // Orange/Gold for emphasis
        const lightGrey = '#f4f4f4';    // For table rows

        // --- 1. HEADER SECTION ---
        doc.fillColor(primaryColor).fontSize(24).font('Helvetica-Bold').text("STYLE STITCH TAILORS", { align: 'center' });
        doc.fontSize(10).font('Helvetica').fillColor('#555').text("123 Fashion Street, Cloth Market, City - 400001", { align: 'center' });
        doc.text("Phone: +91 98765 43210 | Email: contact@stylestitch.com", { align: 'center' });
        
        // Decorative Line
        doc.moveTo(50, doc.y + 5).lineTo(545, doc.y + 5).lineWidth(2).strokeColor(primaryColor).stroke();
        
        doc.moveDown(1);

        // --- 2. INVOICE META INFO (Left: Bill To, Right: Bill Details) ---
        const startY = doc.y;

        // Left Side: Customer Details
        doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text("BILL TO:", 50, startY);
        doc.fontSize(11).font('Helvetica').fillColor('#000');
        doc.text(bill.user?.name || 'N/A', 50, startY + 15);
        if(bill.user?.address) doc.text(bill.user.address, 50, startY + 30, { width: 200 });
        if(bill.user?.phone) doc.text(`Ph: ${bill.user.phone}`, 50, doc.y + 5);

        // Right Side: Invoice Details
        const rightX = 350;
        doc.fontSize(10).font('Helvetica').fillColor('#555').text("Invoice No:", rightX, startY);
        doc.font('Helvetica-Bold').fillColor('#000').text(`#${bill.invoiceNumber}`, rightX + 70, startY);
        
        doc.font('Helvetica').fillColor('#555').text("Date:", rightX, startY + 15);
        doc.font('Helvetica-Bold').fillColor('#000').text(`${new Date(bill.createdAt).toLocaleDateString()}`, rightX + 70, startY + 15);

        doc.font('Helvetica').fillColor('#555').text("Status:", rightX, startY + 30);
        
        // Status Badge Logic
        const statusText = bill.paymentStatus === 'paid' ? 'PAID' : 'PENDING';
        const statusColor = bill.paymentStatus === 'paid' ? '#27ae60' : '#c0392b';
        doc.rect(rightX + 70, startY + 30, 80, 15).fillAndStroke(statusColor, statusColor);
        doc.fillColor('#fff').text(statusText, rightX + 73, startY + 32);

        doc.moveDown(3);

        // --- 3. ITEMS TABLE ---
        const tableTop = doc.y;
        const itemHeaders = ['Description', 'Qty', 'Rate (₹)', 'Amount (₹)'];
        const colWidths = [280, 60, 80, 80];
        const colX = [50, 330, 390, 470];

        // Table Header Background
        doc.rect(50, tableTop, 495, 25).fill(primaryColor);
        
        // Table Header Text
        doc.fillColor('#fff').fontSize(10).font('Helvetica-Bold');
        itemHeaders.forEach((header, i) => {
            doc.text(header, colX[i], tableTop + 8, { width: colWidths[i] });
        });

        let currentY = tableTop + 25;

        // Table Rows
        bill.items.forEach((item, i) => {
            const rowHeight = 25; // Fixed height for rows
            const isEven = i % 2 === 0;

            // Row Background
            if (isEven) {
                doc.rect(50, currentY, 495, rowHeight).fill(lightGrey);
            }

            // Row Text
            doc.fillColor('#000').font('Helvetica').fontSize(10);
            // Item Name
            doc.text(item.name, colX[0], currentY + 8, { width: colWidths[0] });
            // Qty
            doc.text(item.quantity.toString(), colX[1], currentY + 8, { width: colWidths[1] });
            // Price
            doc.text(`₹${item.price.toFixed(2)}`, colX[2], currentY + 8, { width: colWidths[2] });
            // Total
            doc.text(`₹${item.total.toFixed(2)}`, colX[3], currentY + 8, { width: colWidths[3] });

            currentY += rowHeight;
        });

        // Table Bottom Border
        doc.moveTo(50, currentY).lineTo(545, currentY).lineWidth(1).strokeColor('#ccc').stroke();
        doc.moveDown(1);

        // --- 4. SUMMARY SECTION ---
        const summaryX = 350;
        const summaryY = doc.y;

        doc.lineWidth(1).strokeColor('#ccc');
        doc.rect(summaryX - 10, summaryY - 10, 195, 110).stroke(); // Box around totals

        // Helper for summary rows
        const printSummaryRow = (label, amount, isBold = false, isTotal = false) => {
            doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica').fillColor(isTotal ? accentColor : '#000').fontSize(isTotal ? 14 : 10);
            doc.text(label, summaryX, summaryY, { width: 100 });
            doc.text(`₹${amount.toFixed(2)}`, summaryX + 100, summaryY, { width: 75, align: 'right' });
            doc.y += 20;
        };

        printSummaryRow("Subtotal:", bill.subtotal || bill.items.reduce((acc, item) => acc + item.total, 0));
        printSummaryRow("Tax:", bill.tax || 0);
        printSummaryRow("Discount:", `-${bill.discount || 0}`);
        
        // Divider for Total
        doc.moveTo(summaryX, doc.y + 2).lineTo(summaryX + 185, doc.y + 2).lineWidth(1).strokeColor('#ccc').stroke();
        doc.y += 8;
        
        printSummaryRow("GRAND TOTAL:", bill.totalAmount, true, true);

        // --- 5. PAYMENT & QR SECTION ---
        doc.moveDown(2);

        // Box for Payment
        const payBoxY = doc.y;
        doc.rect(50, payBoxY, 495, 160).lineWidth(1).strokeColor('#ddd').stroke();

        // Payment Text Left
        doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text("PAYMENT DETAILS", 70, payBoxY + 20);
        doc.fontSize(10).font('Helvetica').fillColor('#555').text("Please complete your payment using UPI.", 70, payBoxY + 40);
        
        // Bank Details (Example)
        doc.text("Bank Name: XYZ Bank", 70, payBoxY + 60);
        doc.text("Account No: 1234567890", 70, payBoxY + 75);
        doc.text("IFSC Code: XYZB0001234", 70, payBoxY + 90);
        doc.text("UPI ID: yourupi@bank", 70, payBoxY + 105);

        // QR Code Right
        const upiUrl = `upi://pay?pa=yourupi@bank&pn=Your Store&am=${bill.totalAmount}&cu=INR&tn=${bill.invoiceNumber}`;
        const qrImage = await QRCode.toDataURL(upiUrl);
        const qrBuffer = Buffer.from(qrImage.split(',')[1], 'base64');

        doc.fontSize(10).font('Helvetica-Bold').fillColor('#000').text("SCAN TO PAY", 360, payBoxY + 20, { width: 100, align: 'center' });
        
        doc.image(qrBuffer, 375, payBoxY + 40, { fit: [100, 100], align: 'center' });

        // --- 6. FOOTER ---
        doc.moveDown(2);
        doc.fontSize(10).font('Helvetica-Oblique').fillColor('#777').text("Terms & Conditions:", 50, doc.y, { underline: true });
        doc.font('Helvetica').fontSize(9).text("1. Goods once sold will not be taken back.", 50, doc.y + 5);
        doc.text("2. Please check the measurements before delivery.", 50, doc.y + 15);
        
        doc.moveDown(1.5);
        doc.fontSize(10).font('Helvetica-Bold').fillColor(primaryColor).text("*** Thank you for your business! ***", { align: 'center' });

        doc.end();

    } catch (err) {
        next(err);
    }
};