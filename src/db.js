// src/db.js
const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
  console.error('❌ Ошибка: переменная окружения DATABASE_URL не установлена!');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }  // обязательно для Railway
});

module.exports = pool;
