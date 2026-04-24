const express = require('express');
const pool = require('../db');
const { isAuthenticated } = require('../middleware/auth');
const { executeCode } = require('../validators');
const { runCode } = require('../executeNative');

const router = express.Router();
router.use(isAuthenticated);

router.post('/', async (req, res) => {
  const { error, value } = executeCode.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const result = await runCode(value.language, value.code, value.stdin || '');

    // Логирование
    await pool.query(
      'INSERT INTO logs (user_id, action, details) VALUES ($1, $2, $3)',
      [req.session.userId, 'execute', `language: ${value.language}, length: ${value.code.length}`]
    );

    res.json(result);
  } catch (err) {
    console.error('Ошибка выполнения:', err);
    res.status(500).json({ error: 'Ошибка выполнения кода' });
  }
});

module.exports = router;