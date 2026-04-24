const { Pool } = require('pg');

function createPool() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL не задана. Повторная попытка через 5 секунд...');
    return null;
  }
  return new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
}

let pool = createPool();
if (!pool) {
  // Ждём и пробуем ещё раз
  setTimeout(() => {
    pool = createPool();
  }, 5000);
}

module.exports = {
  getPool: () => pool
};
