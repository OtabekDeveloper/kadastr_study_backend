const multer = require("multer");
const fs = require("fs");
const path = require("path");

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
  "image/bmp",
  "image/heic",
  "image/webp",
];

const uploadDir = path.join(process.cwd(), "uploads", "docs");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `file-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Faqat rasm yuklash mumkin"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).any();

const handleFiles = (req) => {
  if (req.files?.file) {
    req.body.file = `docs/${req.files.file[0].filename}`;
  }

  if (req.files?.options) {
    req.body.options = req.files.options.map((f) => `docs/${f.filename}`);
  }
};

exports.uploadQuestionFiles = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message || "Upload error" });
    }

    handleFiles(req);
    next();
  });
};
