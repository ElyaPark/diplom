const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:bookId', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const bookId = req.params.bookId;

  try {
    const result = await db.query(
      'SELECT page_number FROM book_progress WHERE user_id = $1 AND book_id = $2',
      [userId, bookId]
    );
    res.json({ page_number: result.rows[0]?.page_number || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка получения прогресса' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const { bookId, pageNumber } = req.body;

  try {
    await db.query(`
      INSERT INTO book_progress (user_id, book_id, page_number)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, book_id) DO UPDATE SET page_number = $3, updated_at = NOW()
    `, [userId, bookId, pageNumber]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сохранения прогресса' });
  }
});


router.get('/', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(`
      SELECT bp.book_id, bp.page_number, b.title, b.total_pages
      FROM book_progress bp
      JOIN books b ON bp.book_id = b.id
      WHERE bp.user_id = $1
      ORDER BY bp.updated_at DESC
    `, [userId]);

    const progressList = result.rows.map(row => ({
      bookId: row.book_id,
      title: row.title,
      currentPage: row.page_number,
      totalPages: row.total_pages,
      progressPercent: ((row.page_number / row.total_pages) * 100).toFixed(1),
    }));

    res.json(progressList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка получения списка прогресса' });
  }
});

module.exports = router;
