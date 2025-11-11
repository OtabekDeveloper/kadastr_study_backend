const fs = require("fs");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const cer_url = process.env?.CERTIFICATES_URL
const moment = require("moment");


async function generateCertificate(firstName, lastName, subject, score, certificate_code) {

    const today = moment();

    // Oy nomlarini o‘zbekcha
    const monthsUz = [
        "yanvar", "fevral", "mart", "aprel", "may", "iyun",
        "iyul", "avgust", "sentyabr", "oktyabr", "noyabr", "dekabr"
    ];

    const day = today.date();
    const month = monthsUz[today.month()]; // moment.month() 0–11 oralig‘ida
    const year = today.year();

    const formatted = `"${day}" ${month} ${year} y.`;

    const uniqueName = `file_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const doc = new PDFDocument({ size: "A4", layout: "landscape" });
    doc.page.margins = { top: 20, bottom: 0, left: 20, right: 20 };
    const filePath = `${process.cwd()}/uploads/certificates/${uniqueName}.pdf`;

    if (!fs.existsSync(`${process.cwd()}/uploads/certificates`)) {
        fs.mkdirSync(`${process.cwd()}/uploads/certificates`);
    }

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);



    // Logo joylashtirish
    const bgPath = `${process.cwd()}/logos/logo.png`;
    if (fs.existsSync(bgPath)) {
        doc.image(bgPath, 0, 0, { width: doc.page.width, height: doc.page.height });
    }

    doc.font(`${process.cwd()}/fonts/Tinos-Bold.ttf`).moveDown(4);
    doc.fontSize(18).text("O‘zbekiston Respublikasi Iqtisodiyot va moliya vazirligi \nhuzuridagi Kadastr agentligining \n Davlat kadastrlari palatasi", { align: "center", lineGap: 8 });

    doc.fontSize(36).fillColor("#FF0000").text("SERTIFIKAT", { align: "center", lineGap: 8 });
    // Keyingi matnlar qora rangda bo‘lishi uchun
    doc.fillColor("#000000");

    doc.fontSize(16).text(`${String.fromCharCode(8470)} ${certificate_code}`, { align: "center", underline: true, lineGap: 8 });

    doc.fontSize(20).text(`${firstName.toString().toUpperCase()} ${lastName.toString().toUpperCase()}`, { align: "center", lineGap: 8 });

    doc.fontSize(18).text(`
    Davlat kadastrlari palatasining tizimida faoliyat yuritayotgan xodim.
    Masofaviy 36 soatli ${subject} kursida malakasini oshirdi.`, { align: "center", lineGap: 8 });
    doc.fontSize(18).text(`\nYakuniy imtihon natijasiga ko‘ra ${score} ball bilan baholandi.`, { align: "center", });
    // QR code yaratish
    const qrData = `${cer_url}/certificates/${uniqueName}.pdf`;
    const qrCodeImage = await QRCode.toDataURL(qrData, {
        margin: 0,
    });

    const qrImageBuffer = Buffer.from(qrCodeImage.split(",")[1], "base64");
    doc.image(qrImageBuffer, 610, doc.page.height - 110, { width: 60 });

    doc.moveDown(3.5);
    doc.text(`Rais:`, 540, doc.page.height - 90);
    doc.text(`M.Valiyev`, 690, doc.page.height - 90);
    doc.fontSize(12);
    doc.font(`${process.cwd()}/fonts/Tinos-BoldItalic.ttf`)
    doc.text(`Sana:`, 450, doc.page.height - 40);
    doc.text(formatted, 480, doc.page.height - 40, { underline: true });

    doc.text(`Qayd raqami:`, 690, doc.page.height - 40);
    doc.text(certificate_code, 760, doc.page.height - 40, { underline: true });


    doc.end();

    return `certificates/${uniqueName}.pdf`
}

module.exports = generateCertificate;
