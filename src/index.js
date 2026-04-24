// src/index.js (фрагмент)
const pool = require('./db');

// Функция ожидания
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Функция инициализации БД с повторными попытками
const initDatabase = async () => {
  let attempts = 5;
  while (attempts > 0) {
    try {
      console.log(`Проверка базы данных (осталось попыток: ${attempts})...`);
      const tableExists = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' AND table_name = 'users'
        );
      `);

      if (!tableExists.rows[0].exists) {
        console.log('Таблицы не найдены. Применяю init.sql...');
        const initSqlPath = path.join(__dirname, '..', 'init.sql');
        const initSql = fs.readFileSync(initSqlPath, 'utf-8');
        await pool.query(initSql);
        console.log('✅ База данных успешно инициализирована.');
      } else {
        console.log('✅ База данных уже инициализирована.');
      }
      return; // успех
    } catch (error) {
      console.error(`❌ Ошибка подключения: ${error.message}`);
      attempts--;
      if (attempts > 0) {
        console.log(`Следующая попытка через 5 секунд...`);
        await sleep(5000);
      } else {
        console.error('Исчерпаны все попытки подключения к базе данных.');
        process.exit(1);
      }
    }
  }
};

// Запуск
initDatabase()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Критическая ошибка:', err);
    process.exit(1);
  });
