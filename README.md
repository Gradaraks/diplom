# Веб-компилятор (без Docker)

Приложение для написания и выполнения кода на Python, C++, JavaScript и SQL.

## Технологии
- Клиент: React, Monaco Editor
- Сервер: Node.js, Express
- База данных: PostgreSQL

## Запуск (автоматический на Render)
1. Создайте репозиторий из этого шаблона.
2. На Render.com создайте **PostgreSQL** и скопируйте Internal Database URL.
3. Создайте **Web Service**, подключите репозиторий, задайте переменные окружения:
   - `DATABASE_URL` = скопированный URL
   - `SESSION_SECRET` = случайная строка
   - `EXEC_TIMEOUT` = 10
4. После деплоя выполните `init.sql` через Shell Render или pgAdmin.
5. Откройте публичный URL.