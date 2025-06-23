const express = require('express');
console.log("Books route loaded");
const router = express.Router();
const db = require('../db');


router.get('/:id/progress', async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ error: 'Неавторизован' });

    const bookId = req.params.id;
    const result = await db.query(
      'SELECT page_number FROM book_progress WHERE user_id = $1 AND book_id = $2',
      [userId, bookId]
    );
    res.json({ currentPage: result.rows[0]?.page_number || 0 });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


router.post('/:id/progress', async (req, res) => {
  try {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ error: 'Неавторизован' });

    const bookId = req.params.id;
    const { currentPage } = req.body;

    await db.query(`
      INSERT INTO book_progress (user_id, book_id, page_number)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, book_id) DO UPDATE SET page_number = $3, updated_at = NOW()
    `, [userId, bookId, currentPage]);

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
