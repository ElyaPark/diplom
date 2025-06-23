const pool = require("../db");

exports.markWordLearned = async (req, res) => {
  const userId = req.user.id;
  const { word_id } = req.body;

  if (!word_id) return res.status(400).json({ message: "Не указан word_id" });

  try {
    await pool.query(
      `INSERT INTO user_words (user_id, word_id, learned)
       VALUES ($1, $2, true)
       ON CONFLICT (user_id, word_id) DO UPDATE SET learned = true, learned_at = CURRENT_TIMESTAMP`,
      [userId, word_id]
    );
    res.json({ message: "Слово отмечено как выученное" });
  } catch (err) {
    console.error("Ошибка при сохранении слова:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.markLessonCompleted = async (req, res) => {
  const userId = req.user.id;
  const { lesson_id } = req.body;

  if (!lesson_id) return res.status(400).json({ message: "Не указан lesson_id" });

  try {
    await pool.query(
      `INSERT INTO user_lessons (user_id, lesson_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [userId, lesson_id]
    );
    res.json({ message: "Урок отмечен как завершённый" });
  } catch (err) {
    console.error("Ошибка при сохранении урока:", err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};