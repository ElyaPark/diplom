
const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/topics', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, title FROM crossword_topics ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения тем:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


router.get('/:topicId', async (req, res) => {
  try {
    const topicId = req.params.topicId;
    const result = await pool.query(
      'SELECT id, index_number FROM crosswords WHERE topic_id = $1 ORDER BY index_number',
      [topicId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Ошибка получения кроссвордов:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});


router.get('/:topicId/:index', async (req, res) => {
  try {
    const { topicId, index } = req.params;

    const crosswordResult = await pool.query(
      'SELECT id, grid FROM crosswords WHERE topic_id = $1 AND index_number = $2',
      [topicId, index]
    );

    if (crosswordResult.rows.length === 0) {
      return res.status(404).json({ error: 'Кроссворд не найден' });
    }

    const crosswordId = crosswordResult.rows[0].id;
    const grid = crosswordResult.rows[0].grid;

    const cluesResult = await pool.query(
      'SELECT number, clue, answer FROM clues WHERE crossword_id = $1 ORDER BY number',
      [crosswordId]
    );

    res.json({
      grid,
      clues: cluesResult.rows
    });
  } catch (err) {
    console.error('Ошибка получения данных кроссворда:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;
