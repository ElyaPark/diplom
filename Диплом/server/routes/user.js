
const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middleware/authMiddleware");
const path = require("path");
const multer = require("multer");
const userController = require("../controllers/userController");
const uploadController = require("../controllers/uploadController");


router.get("/profile", authMiddleware, userController.getProfile);



router.get("/friends", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const friendsRes = await pool.query(
      `SELECT u.id, u.username, u.avatar FROM users u
       JOIN user_friends uf ON 
         (uf.user_id = $1 AND uf.friend_id = u.id)
         OR (uf.friend_id = $1 AND uf.user_id = u.id)`,
      [userId]
    );

    res.json(friendsRes.rows);
  } catch (err) {
    console.error("Ошибка при получении друзей:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});



router.post("/friends/add", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;
    if (!friendId) return res.status(400).json({ message: "friendId обязателен" });

    await pool.query(
      "INSERT INTO user_friends (user_id, friend_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
      [userId, friendId]
    );

    res.json({ message: "Друг добавлен" });
  } catch (err) {
    console.error("Ошибка при добавлении друга:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

router.post("/friends/remove", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.body;
    if (!friendId) return res.status(400).json({ message: "friendId обязателен" });

    await pool.query(
      "DELETE FROM user_friends WHERE (user_id = $1 AND friend_id = $2) OR (friend_id = $1 AND user_id = $2)",
      [userId, friendId]
    );

    res.json({ message: "Друг удалён" });
  } catch (err) {
    console.error("Ошибка при удалении друга:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});



router.get("/all", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT id, username, avatar FROM users WHERE id != $1", [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error("Ошибка при получении всех пользователей:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});






const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/uploads/avatars"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, name);
  }
});
const upload = multer({ storage });


router.post("/avatar", authMiddleware, upload.single("avatar"), uploadController.uploadAvatar);


router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await pool.query(
      "SELECT username, avatar FROM users WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: "Пользователь не найден" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ошибка получения друга:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});


module.exports = router;
