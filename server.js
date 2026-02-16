const express = require('express');
const path = require('path');
const https = require('https');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Telegram Bot Configuration
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID';

// Middleware для обработки JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Функция отправки сообщения в Telegram
function sendToTelegram(message) {
  return new Promise((resolve, reject) => {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const postData = JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'HTML'
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result.ok) {
            resolve(result);
          } else {
            reject(new Error(result.description || 'Telegram API error'));
          }
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// API endpoint для отправки заявки
app.post('/api/send-order', async (req, res) => {
  try {
    const { name, company, phone, email, message } = req.body;

    // Валидация
    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Имя и телефон обязательны' });
    }

    // Формирование сообщения для Telegram
    const telegramMessage = `
      📩 Новая заявка с сайта
      <b>👤 Имя:</b> ${name}
      <b>🏢 Организация:</b> ${company || 'Не указана'}
      <b>📞 Телефон:</b> ${phone}
      <b>📧 Email:</b> ${email || 'Не указан'}
      <b>💬 Сообщение:</b> ${message || 'Нет'}
    `;

    await sendToTelegram(telegramMessage);

    res.json({ success: true, message: 'Заявка успешно отправлена' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Ошибка отправки заявки' });
  }
});

// Обработка 404 ошибки
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Сервер запущен на http://0.0.0.0:${PORT}`);
});
