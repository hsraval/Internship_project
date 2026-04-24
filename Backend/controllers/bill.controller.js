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

// ================= Final Code for download Bill
exports.downloadBillPDF = async (req, res, next) => {
    try {
        console.log('=== BILL DOWNLOAD DEBUG ===');
        console.log('User:', req.user);
        console.log('Cookies:', req.cookies);
        console.log('Headers:', req.headers);
        
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Order ID"
            });
        }

        console.log(`Looking for bill with order ID: ${id}`);
        
        const bill = await Bill.findOne({order:id})
            .populate('user', 'name email')
            .populate('order')
            .lean();

        if (!bill) {
            console.log(`No bill found for order ID: ${id}`);
            return res.status(404).json({
                success: false,
                message: "Invoice not available for this order. Please contact support if you believe this is an error."
            });
        }

        console.log(`Bill found: ${bill.invoiceNumber}`);

        const doc = new PDFDocument({
            margin: 50,
            size: 'A4',
            info: {
                Title: `Invoice ${bill.invoiceNumber}`,
                Author: 'Style Stitch Tailors',
            }
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="Invoice_${bill.invoiceNumber}.pdf"`
        );

        doc.pipe(res);

        // --- CONFIGURATION ---
        const primaryColor = '#2c3e50';
        const accentColor = '#e67e22';
        const lightGrey = '#f4f4f4';

        // --- 1. HEADER SECTION ---
        doc.fillColor(primaryColor).fontSize(24).font('Helvetica-Bold').text("Larkinse MensWear & PurchasePoint", { align: 'center' });
        doc.fontSize(10).font('Helvetica').fillColor('#555').text("Shop-1,Shivnidhi Appartment,Opp. ICICI Bank,Ghodasar,Ahmedabad", { align: 'center' });
        doc.text("Phone: +91 98765 43210 | Email: contact@stylestitch.com", { align: 'center' });
        
        // Decorative Line
        doc.moveTo(50, doc.y + 5).lineTo(545, doc.y + 5).lineWidth(2).strokeColor(primaryColor).stroke();
        
        doc.moveDown(1);

        // --- 2. INVOICE META INFO ---
        const startY = doc.y;

        // Left Side: Customer Details
        doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text("BILL TO:", 50, startY);
        doc.fontSize(11).font('Helvetica').fillColor('#000');
        doc.text(bill.user?.name || 'N/A', 50, startY + 15);
        // Uncomment below if you have address/phone fields in your user model
        // if(bill.user?.address) doc.text(bill.user.address, 50, startY + 30, { width: 200 });
        // if(bill.user?.phone) doc.text(`Ph: ${bill.user.phone}`, 50, doc.y + 5);

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

        doc.moveDown(2); // Slight gap before table

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
            const rowHeight = 25; 
            const isEven = i % 2 === 0;

            if (isEven) {
                doc.rect(50, currentY, 495, rowHeight).fill(lightGrey);
            }

            doc.fillColor('#000').font('Helvetica').fontSize(10);
            doc.text(item.name, colX[0], currentY + 8, { width: colWidths[0] });
            doc.text(item.quantity.toString(), colX[1], currentY + 8, { width: colWidths[1] });
            doc.text(`₹${Number(item.price || 0).toFixed(2)}`, colX[2], currentY + 8, { width: colWidths[2] });
            doc.text(`₹${Number(item.total || 0).toFixed(2)}`, colX[3], currentY + 8, { width: colWidths[3] });

            currentY += rowHeight;
        });

        // Table Bottom Border
        doc.moveTo(50, currentY).lineTo(545, currentY).lineWidth(1).strokeColor('#ccc').stroke();
        
        const tableEndY = currentY; // Store where the table actually ended

        // --- 4. SUMMARY SECTION (FIXED POSITION) ---
        // We set the summary Y explicitly below the table, rather than using doc.moveDown()
        const summaryY = tableEndY + 30; 
        const summaryX = 350;

        // Draw box first
        doc.lineWidth(1).strokeColor('#ccc');
        // Box height: 120px (accommodates 4 rows + divider + spacing)
        doc.rect(summaryX - 10, summaryY, 195, 120).stroke(); 

        let currentSummaryRowY = summaryY + 15; // Padding inside box

        const printSummaryRow = (label, amount, isBold = false, isTotal = false) => {
            doc.font(isBold ? 'Helvetica-Bold' : 'Helvetica')
               .fillColor(isTotal ? accentColor : '#000')
               .fontSize(isTotal ? 14 : 10);
            
            doc.text(label, summaryX, currentSummaryRowY, { width: 100 });
            doc.text(`₹${amount.toFixed(2)}`, summaryX + 100, currentSummaryRowY, { width: 75, align: 'right' });
            
            currentSummaryRowY += 20; // Move Y down for next row inside the box
        };

        const subtotal = bill.subtotal || bill.items.reduce((acc, item) => acc + item.total, 0);
        
        printSummaryRow("Subtotal:", subtotal);
        printSummaryRow("Tax:", bill.tax || 0);
        printSummaryRow("Discount:", -(bill.discount || 0));
        
        // Divider
        doc.moveTo(summaryX, currentSummaryRowY + 2).lineTo(summaryX + 185, currentSummaryRowY + 2).lineWidth(1).strokeColor('#ccc').stroke();
        currentSummaryRowY += 10;
        
        printSummaryRow("GRAND TOTAL:", bill.totalAmount, true, true);

        // --- 5. PAYMENT & QR SECTION (FIXED POSITION) ---
        const paymentSectionY = summaryY + 130; // Start 30px below the summary box (summaryY + 120 height)

        // Box for Payment
        doc.rect(50, paymentSectionY, 495, 150).lineWidth(1).strokeColor('#ddd').stroke();

        // Payment Text Left
        doc.fontSize(12).font('Helvetica-Bold').fillColor(primaryColor).text("PAYMENT DETAILS", 70, paymentSectionY + 20);
        doc.fontSize(10).font('Helvetica').fillColor('#555').text("Please complete your payment using UPI.", 70, paymentSectionY + 40);
        
        doc.text("Bank Name: XYZ Bank", 70, paymentSectionY + 60);
        doc.text("Account No: 1234567890", 70, paymentSectionY + 75);
        doc.text("IFSC Code: XYZB0001234", 70, paymentSectionY + 90);
        doc.text("UPI ID: yourupi@bank", 70, paymentSectionY + 105);

        // QR Code Right
        try {
            
            const upiUrl = `upi://pay?pa=kashyapgaliya295@okhdfcbank&pn=Your Store&am=${bill.totalAmount}&cu=INR&tn=${bill.invoiceNumber}`;
            const qrImage = await QRCode.toDataURL(upiUrl);
            const qrBuffer = Buffer.from(qrImage.split(',')[1], 'base64');

            doc.fontSize(10).font('Helvetica-Bold').fillColor('#000').text("SCAN TO PAY", 360, paymentSectionY + 20, { width: 100, align: 'center' });
            // Fit QR code within the box
            doc.image(qrBuffer, 375, paymentSectionY + 40, { fit: [100, 100], align: 'center' });
        } catch (err) {
            console.error("QR Code generation failed", err);
            doc.fontSize(9).fillColor('red').text("QR Error", 410, paymentSectionY + 80);
        }

        // --- 6. FOOTER / TERMS (FIXED POSITION) ---
        const footerY = paymentSectionY + 170; // Start 20px below payment box

        doc.fontSize(10).font('Helvetica-Oblique').fillColor('#777').text("Terms & Conditions:", 50, footerY, { underline: true });
        
        const termY = footerY + 20; // explicit Y for terms
        doc.font('Helvetica').fontSize(9).text("1. Goods once sold will not be taken back.", 50, termY);
        doc.text("2. Please check the measurements before delivery.", 50, termY + 15);
        
        doc.moveDown(1.5);
        doc.fontSize(10).font('Helvetica-Bold').fillColor(primaryColor).text("*** Thank you for your business! ***", { align: 'center' });

        doc.end();

    } catch (err) {
        console.error("PDF Generation Error:", err);
        next(err);
    }
};