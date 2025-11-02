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

    doc.font(`${process.cwd()}/fonts/Tinos-Bold.ttf`).moveDown(5);
    doc.fontSize(18).text("O‘zbekiston Respublikasi Iqtisodiyot va moliya vazirligi huzuridagi \n Kadastr agentligi", { align: "center" });

    doc.fontSize(36).fillColor("#FF0000").text("SERTIFIKAT", { align: "center" });
    // Keyingi matnlar qora rangda bo‘lishi uchun
    doc.fillColor("#000000");

    doc.fontSize(16).text(`${String.fromCharCode(8470)} ${certificate_code}`, { align: "center" });

    doc.fontSize(20).text(`${firstName.toString().toUpperCase()} ${lastName.toString().toUpperCase()}`, { align: "center" });
    doc.moveDown(1);
    doc.fontSize(15).text(` 2024-yil 31-maydan 2024-yil 6-iyungacha Kadastr agentligida jami 36 soatli
     Hisobchilar malakasini oshirish bo'yicha Kadastr agentligining hududiy
      boshqarmalari hamda Tizim tashkilotlarda faoliyat yuritayotgan xodimlari malakasini 
      oshirish o'quv kursida (${subject}) malaka oshirdi 
      Yakuniy imtihon natijasiga ko'ra ${score} ball bilan baholandi.`, { align: "center", lineGap: 8 });


    // QR code yaratish
    const qrData = `${cer_url}/certificates/${uniqueName}.pdf`;
    const qrCodeImage = await QRCode.toDataURL(qrData, {
        margin: 0,
      });

    const qrImageBuffer = Buffer.from(qrCodeImage.split(",")[1], "base64");
    doc.image(qrImageBuffer, 45, doc.page.height - 150, { width: 100 });    

    doc.moveDown(4);
    doc.fontSize(15).text(`Direktor:              A. S. Avazov`, { align: "right" });
    doc.moveDown(0.5);
    doc.fontSize(11).text(` Sana: ${formatted}       Qayd raqami ${certificate_code}`, { align: "right" });



    doc.end();

    return `certificates/${uniqueName}.pdf`
}

module.exports = generateCertificate;
