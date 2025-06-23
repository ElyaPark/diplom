const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage: storage });

router.post("/avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Нет файла" });
  const fileUrl = "/uploads/" + req.file.filename;
  res.json({ url: fileUrl });
});

module.exports = router;