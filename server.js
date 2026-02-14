const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Обслуживание статических файлов
app.use(express.static(path.join(__dirname)));

// Маршрут для главной страницы
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Маршрут для политики конфиденциальности
app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'privacy-policy.html'));
});

// Маршрут для условий использования
app.get('/terms-of-service', (req, res) => {
  res.sendFile(path.join(__dirname, 'terms-of-service.html'));
});

// Обработка 404 ошибки
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на http://0.0.0.0:${PORT}`);
});
