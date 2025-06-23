const express = require('express');
const router = express.Router();
const pool = require('../db');


router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dramas ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении дорам' });
  }
});


router.get('/:id/episodes', async (req, res) => {
  const dramaId = req.params.id;
  try {
    const result = await pool.query('SELECT * FROM episodes WHERE drama_id = $1 ORDER BY id', [dramaId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при получении серий' });
  }
});

module.exports = router;
