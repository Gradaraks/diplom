const express = require('express');
const pool = require('../db');
const { isAuthenticated } = require('../middleware/auth');
const { saveScript } = require('../validators');

const router = express.Router();
router.use(isAuthenticated);

// Список скриптов пользователя
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, name, language, updated_at FROM scripts WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.session.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка БД' });
  }
});

// Создать / обновить скрипт
router.post('/', async (req, res) => {
  const { error, value } = saveScript.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const { rows } = await pool.query(
      `INSERT INTO scripts (user_id, name, language, code)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (user_id, name) DO UPDATE
       SET code = EXCLUDED.code, language = EXCLUDED.language, updated_at = NOW()
       RETURNING id, name, language`,
      [req.session.userId, value.name, value.language, value.code]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сохранения' });
  }
});

// Удалить скрипт
router.delete('/:id', async (req, res) => {
  try {
    const { rowCount } = await pool.query(
      'DELETE FROM scripts WHERE id = $1 AND user_id = $2',
      [req.params.id, req.session.userId]
    );
    if (rowCount === 0) return res.status(404).json({ error: 'Скрипт не найден' });
    res.json({ message: 'Удалён' });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка удаления' });
  }
});

module.exports = router;