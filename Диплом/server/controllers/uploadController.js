
const path = require("path");
const fs = require("fs");
const pool = require("../db");

exports.uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "Файл не загружен" });

  const userId = req.user.id;
  const avatarUrl = `/uploads/avatars/${req.file.filename}`;


  await pool.query("UPDATE users SET avatar = $1 WHERE id = $2", [avatarUrl, userId]);
  res.json({ avatar: avatarUrl });


};
