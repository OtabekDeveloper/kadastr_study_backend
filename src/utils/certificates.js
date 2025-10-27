const fs = require("fs");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

async function generateCertificate({ name, testName, score, date, certificateId }) {
    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    const filePath = `${process.cwd()}/uploads/certificates/${certificateId}.pdf`;

    if (!fs.existsSync(`${process.cwd()}/uploads/certificates`)) {
        fs.mkdirSync(`${process.cwd()}/uploads/certificates`);
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Background color or border
    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f9f9f9");
    doc.fillColor("#000");

    // Logo joylashtirish
    const logoPath = `${process.cwd()}/logos/logo.png`;
    if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 60, 40, { width: 100 });
    }

    doc.font(`${process.cwd()}/fonts/TIMES.TTF`).moveDown(3);
    doc.fontSize(20).text("O‘zbekiston Respublikasi Iqtisodiyot va moliya vazirligi huzuridagi \n Kadastr agentligi", { align: "center" });
    doc.moveDown(0.1);

    doc.fontSize(28).fillColor("#FF0000").text("SERTIFIKAT", { align: "center" });
    // Keyingi matnlar qora rangda bo‘lishi uchun
    doc.fillColor("#000000");
    doc.moveDown(0.1);
    doc.fontSize(30).text(`${String.fromCharCode(8470)} ${455}`, { align: "center" });
    doc.moveDown(1);

    doc.fontSize(18).text(`for successfully completing the test:`, { align: "center" });
    doc.fontSize(22).text(testName, { align: "center" });
    doc.moveDown(1);

    doc.fontSize(18).text(`Score: ${score}%`, { align: "center" });
    doc.fontSize(14).text(`Date: ${date}`, { align: "center" });
    doc.moveDown(2);

    // QR code yaratish
    const qrData = `https://yourwebsite.com/certificate/${certificateId}`;
    const qrCodeImage = await QRCode.toDataURL(qrData);

    const qrImageBuffer = Buffer.from(qrCodeImage.split(",")[1], "base64");
    doc.image(qrImageBuffer, doc.page.width - 180, doc.page.height - 180, { width: 120 });

    doc.fontSize(10).text(`Certificate ID: ${certificateId}`, 50, doc.page.height - 70);

    doc.end();

    return new Promise((resolve) => {
        writeStream.on("finish", () => resolve(filePath));
    });
}

module.exports = generateCertificate;
