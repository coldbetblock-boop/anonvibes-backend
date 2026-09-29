const { Telegraf } = require('telegraf');
const express = require('express');

const bot = new Telegraf(process.env.BOT_TOKEN);
const app = express();

app.use(express.json());

bot.start((ctx) => {
    ctx.reply('👋 Добро пожаловать в Anon Vibes!\n\nНажмите кнопку ниже, чтобы открыть анонимный чат и отправить сообщение:', {
        reply_markup: {
            inline_keyboard: [
                [{ text: '🚀 Открыть Anon Vibes', web_app: { url: 'https://anonvibes-web-app.vercel.app' } }]
            ]
        }
    });
});

bot.launch().then(() => {
    console.log('Бот Anon Vibes успешно запущен!');
});

const PORT = process.env.PORT || 3000;
app.get('/', (req, res) => {
    res.send('Anon Vibes backend is running!');
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
