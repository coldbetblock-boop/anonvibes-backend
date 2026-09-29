const { Telegraf } = require('telegraf');
const express = require('express');
const path = require('path');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

app.use(express.json());

// Раздаем статические файлы фронтенда из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Обработка кнопки старт в боте (передает ID пользователя через startapp)
bot.start((ctx) => {
    const userId = ctx.from.id;
    // URL вашего бэкенда на Render, который теперь сам отдает фронтенд
    const webAppUrl = `https://anonvibes-backend-yuox.onrender.com?startapp=${userId}`;

    ctx.reply('👋 Добро пожаловать в Anon Vibes!\n\nНажмите ниже, чтобы открыть анонимный чат и отправить сообщение:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚀 Открыть Anon Vibes', web_app: { url: webAppUrl } }]
            ]
        }
    });
});

// API для приема анонимных сообщений из веб-приложения
app.post('/api/send-message', async (req, res) => {
    const { recipient_id, message } = req.body;

    if (!recipient_id || !message) {
        return res.status(400).json({ success: false, error: 'Получатель или сообщение не указаны' });
    }

    try {
        // Отправляем сообщение получателю через бота
        await bot.telegram.sendMessage(
            recipient_id, 
            `📩 Вам пришло новое анонимное сообщение:\n\n${message}`
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Ошибка отправки сообщения:', err);
        res.status(500).json({ success: false, error: 'Не удалось отправить сообщение' });
    }
});

bot.launch().then(() => {
    console.log('Бот Anon Vibes успешно запущен!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
