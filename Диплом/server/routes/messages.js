const express = require("express");
const router = express.Router();
const db = require("../db");


router.get("/:friendId", async (req, res) => {
  const userId = req.session.userId;
  const friendId = parseInt(req.params.friendId);

  if (!userId || isNaN(friendId)) {
    return res.status(400).send("Некорректный запрос: отсутствует ID");
  }

  try {
    const { rows } = await db.query(
      `SELECT * FROM messages
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY timestamp ASC`,
      [userId, friendId]
    );
    res.json(rows);
  } catch (err) {
    console.error("Ошибка при получении сообщений", err);
    res.status(500).send("Ошибка сервера");
  }
});


router.post("/send", async (req, res) => {
  const senderId = req.session.userId;
  const { receiverId, content } = req.body;

  if (!senderId || !receiverId || !content || isNaN(receiverId)) {
    return res.status(400).send("Некорректные данные для отправки сообщения");
  }

  try {
    await db.query(
      `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)`,
      [senderId, parseInt(receiverId), content]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("Ошибка при отправке сообщения", err);
    res.status(500).send("Ошибка сервера");
  }
});

module.exports = router;
