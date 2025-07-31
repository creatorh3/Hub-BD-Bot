// index.js
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const BotController = require('./bot_controller');
const { startServer } = require('./web/server');

if (!config.botToken) {
  console.error('FATAL ERROR: BOT_TOKEN is not defined. Please set it in your environment variables.');
  process.exit(1);
}

const bot = new TelegramBot(config.botToken, { polling: true });
const controller = new BotController(bot);
controller.listen();

console.log('✅ Hub BD Bot has started successfully.');

startServer(bot);

process.on('uncaughtException', (error) => console.error('❌ Uncaught Exception:', error));
process.on('unhandledRejection', (reason) => console.error('❌ Unhandled Rejection:', reason));