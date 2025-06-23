const db = require("../db");

exports.getMessages = async (req, res) => {
  const userId = req.user.id;
  const friendId = parseInt(req.params.friendId, 10);

  try {
    const result = await db.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2)
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY timestamp ASC`,
      [userId, friendId]
    );

   
    const messages = result.rows.map(row => ({
      senderId: row.sender_id,
      receiverId: row.receiver_id,
      text: row.content,
      createdAt: row.timestamp
    }));

    res.json(messages);
  } catch (err) {
    console.error("Ошибка получения сообщений:", err);
    res.status(500).json({ error: "Ошибка сервера" });
  }
};

exports.sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, text } = req.body;

  try {
    await db.query(
      `INSERT INTO messages (sender_id, receiver_id, content) VALUES ($1, $2, $3)`,
      [senderId, receiverId, text]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error("Ошибка отправки сообщения:", err);
    res.status(500).json({ error: "Ошибка при отправке" });
  }
};
