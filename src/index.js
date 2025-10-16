const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, "../.env"),
  debug: false,
});

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const AppRoutes = require("./router");
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log(`MongoDB ulandi: ${process.env.MONGO_URL}`))
  .catch((err) => {
    console.error("MongoDB ulanishda xato:", err.message);
  });

app.use("/api", AppRoutes);
const root = path.join(__dirname, "../public/build");
app.use(express.static(root));

const UPLOAD_FOLDER_NAME = process.env.UPLOAD_FOLDER_NAME;
const imageRes = path.join(__dirname, `../${UPLOAD_FOLDER_NAME}`);
const allowedExtensions = process.env.ALLOWED_EXTENSIONS.split(",").map((ext) =>
  ext.trim()
);
const expressStaticOptions = {
  dotfiles: "deny",
  index: false,
  fallthrough: false,
  setHeaders: (res, filePath) => {
    const ext = path.extname(filePath).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      res.status(404).send("Forbidden: This file type is not allowed");
      return;
    }
  },
};
app.use("/files", express.static(imageRes, expressStaticOptions));
app.get("/files/:folder/:format/:img", (req, res, next) => {
  readFileDirect(req, res);
});

app.get("/*", (req, res) => {
  res.sendFile("index.html", { root });
});

app.listen(PORT, () => {
  console.log(`Server ishga tushdi: http://localhost:${PORT}`);
});
