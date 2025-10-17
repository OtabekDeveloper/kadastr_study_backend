const multer = require("multer");
const fs = require("fs");
const path = require("path");

const MAX_FILE_SIZE = 100 * 1024 * 1024;
const uploadDir = path.join(process.cwd(), "uploads", "docs");
fs.mkdirSync(uploadDir, { recursive: true });

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/gif",
  "image/bmp",
  "image/heic",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "application/rtf",
  "application/zip",
  "application/x-rar-compressed",
  "application/x-tar",
  "application/x-7z-compressed",
  "video/mp4",
  "video/mpeg",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-flv",
  "video/x-matroska",
];

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
  else cb(new Error("Ruxsat berilmagan fayl turi"), false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE },
}).any();

exports.uploadFiles = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      console.error("❌ Upload error:", err);
      return res.status(400).json({ message: err.message || "Upload error" });
    }

    const videoFile =
      req.files?.find((f) => f.fieldname === "file") ||
      req.files?.find((f) => f.fieldname === "video");

    if (videoFile) {
      req.body.file = `docs/${videoFile.filename}`;
    }

    let docs = [];

    req.files?.forEach((file) => {
      const match = file.fieldname.match(/docs\[(\d+)\]\.path/);
      if (match) {
        const index = Number(match[1]);
        const titleKey = `docs[${index}].title`;
        const title =
          req.body[titleKey] ||
          file.originalname.replace(path.extname(file.originalname), "");
        docs[index] = {
          title,
          path: `docs/${file.filename}`,
        };
      }
    });

    Object.keys(req.body).forEach((key) => {
      const match = key.match(/docs\[(\d+)\]\.path/);
      if (match) {
        const index = Number(match[1]);
        const titleKey = `docs[${index}].title`;
        const title = req.body[titleKey];
        const pathValue = req.body[key];
        if (!docs[index]) {
          docs[index] = { title, path: pathValue };
        }
      }
    });

    req.body.docs = docs.filter(Boolean);

    if (req.files?.some((f) => f.fieldname === "files")) {
      const newFiles = req.files
        .filter((f) => f.fieldname === "files")
        .map((f) => `docs/${f.filename}`);

      const existingFiles =
        Array.isArray(req.body.files) && req.body.files.length > 0
          ? req.body.files
          : typeof req.body.files === "string"
          ? [req.body.files]
          : [];

      req.body.files = [...existingFiles, ...newFiles];
    }

    next();
  });
};
