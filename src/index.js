require('dotenv').config();
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const pool = require('./db');

const authRoutes = require('./routes/auth');
const scriptsRoutes = require('./routes/scripts');
const executeRoutes = require('./routes/execute');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Сессии через PostgreSQL
app.use(session({
  store: new pgSession({ pool, tableName: 'session' }),
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 },
}));

// Статика React (после сборки окажется в client/build)
app.use(express.static(path.join(__dirname, '../client/build')));

// API
app.use('/api/auth', authRoutes);
app.use('/api/scripts', scriptsRoutes);
app.use('/api/execute', executeRoutes);

// Все остальные запросы – index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// Инициализация таблиц (выполняется при первом старте, если таблиц нет)
const initDb = async () => {
  const client = await pool.connect();
  try {
    const check = await client.query("SELECT to_regclass('public.users')");
    if (!check.rows[0].to_regclass) {
      const sql = fs.readFileSync(path.join(__dirname, '../init.sql'), 'utf8');
      await client.query(sql);
      console.log('База данных инициализирована.');
    }
  } finally {
    client.release();
  }
};

const PORT = process.env.PORT || 3000;
initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
  })
  .catch(err => {
    console.error('Ошибка инициализации БД:', err);
    process.exit(1);
  });