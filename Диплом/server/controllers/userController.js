const pool = require("../db");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query("SELECT username, level, avatar, streak, email FROM users WHERE id = $1", [userId]);

    if (!result.rows.length) return res.status(404).json({ message: "Пользователь не найден" });

    const user = result.rows[0];

    res.json({
      username: user.username,
      level: user.level,
      streak: user.streak,
      avatar: user.avatar,
      email: user.email,
      stats: {
        words: 0, 
        accuracy: 87, 
        practiceHours: 0, 
        friendsCount: 0 
      }
    });
  } catch (err) {
    console.error("Ошибка профиля:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};


