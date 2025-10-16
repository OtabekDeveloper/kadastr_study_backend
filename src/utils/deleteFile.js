const fs = require("fs");
const path = require("path");

exports.deleteFile = async (filePath) => {
  try {
    if (!filePath) return;

    const absolutePath = path.join(process.cwd(), "uploads", filePath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      console.log("Fayl o'chirildi:", absolutePath);
    } else {
      console.warn("Fayl topilmadi:", absolutePath);
    }
  } catch (err) {
    console.error("Faylni o'chirishda xatolik:", err.message);
  }
};
