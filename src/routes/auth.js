const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const { authUser } = require('../validators');

const router = express.Router();

// Регистрация
router.post('/register', async (req, res) => {
  const { error } = authUser.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rows.length > 0)
      return res.status(409).json({ error: 'Пользователь уже существует' });

    const hash = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO users (email, password_hash) VALUES ($1, $2)', [email, hash]);
    res.status(201).json({ message: 'Регистрация успешна' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Вход
router.post('/login', async (req, res) => {
  const { error } = authUser.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { email, password } = req.body;
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0)
      return res.status(401).json({ error: 'Неверный email или пароль' });

    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match)
      return res.status(401).json({ error: 'Неверный email или пароль' });

    req.session.userId = rows[0].id;
    res.json({ email: rows[0].email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// Выход
router.post('/logout', (req, res) => {
  req.session.destroy(() => res.json({ message: 'Выход выполнен' }));
});

// Текущий пользователь
router.get('/me', async (req, res) => {
  if (!req.session.userId)
    return res.status(401).json({ error: 'Не авторизован' });
  try {
    const { rows } = await pool.query('SELECT email FROM users WHERE id = $1', [req.session.userId]);
    if (rows.length === 0)
      return res.status(401).json({ error: 'Пользователь не найден' });
    res.json({ email: rows[0].email });
  } catch (err) {
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

module.exports = router;