// index.js

// প্রয়োজনীয় মডিউল বা লাইব্রেরিগুলো ইম্পোর্ট করা হচ্ছে
const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');
const BotController = require('./bot_controller');
const { startServer } = require('./web/server');

/**
 * -----------------------------------------------------------------
 *  অ্যাপ্লিকেশনের প্রধান অংশ
 * -----------------------------------------------------------------
 */

// ১. কনফিগারেশন যাচাই
// বট টোকেন আছে কিনা তা পরীক্ষা করা হচ্ছে। এটি না থাকলে বট চালু হবে না।
if (!config.botToken || config.botToken === 'আপনার_টেলিগ্রাম_বট_টোকেন_এখানে') {
  console.error('ত্রুটি: BOT_TOKEN সেট করা হয়নি!');
  console.error('দয়া করে config.js ফাইলে অথবা Environment Variables-এ আপনার টেলিগ্রাম বট টোকেন যুক্ত করুন।');
  process.exit(1); // অ্যাপ্লিকেশন বন্ধ করে দেওয়া হচ্ছে
}

// ২. টেলিগ্রাম বট চালু করা
// node-telegram-bot-api লাইব্রেরি ব্যবহার করে একটি নতুন বট অবজেক্ট তৈরি করা হচ্ছে।
// 'polling: true' মানে হলো, বটটি ক্রমাগত টেলিগ্রাম সার্ভার থেকে নতুন মেসেজের জন্য খোঁজ নেবে।
const bot = new TelegramBot(config.botToken, { polling: true });

// BotController-এর একটি ইনস্ট্যান্স তৈরি করা হচ্ছে এবং তাকে bot অবজেক্টটি দেওয়া হচ্ছে।
// BotController বটের সমস্ত যুক্তি বা লজিক পরিচালনা করবে।
const controller = new BotController(bot);

// listen() মেথড কল করে বটকে ব্যবহারকারীর মেসেজ শোনার জন্য প্রস্তুত করা হচ্ছে।
controller.listen();

console.log('✅ Hub BD Bot সফলভাবে চালু হয়েছে এবং ব্যবহারকারীদের বার্তা শোনার জন্য প্রস্তুত।');


// ৩. ওয়েব সার্ভার চালু করা
// startServer ফাংশনটি কল করা হচ্ছে, যা Render-এর Cron Job শোনার জন্য প্রয়োজন।
// bot অবজেক্টটি এখানে পাস করা হচ্ছে যাতে সার্ভার থেকে বটকে নিয়ন্ত্রণ করা যায় (যেমন: নোটিফিকেশন পাঠানো)।
startServer(bot);


// ৪. ত্রুটি ব্যবস্থাপনা (Error Handling)
// এই অংশটি নিশ্চিত করে যে, কোনো অপ্রত্যাশিত ভুলের কারণে পুরো অ্যাপ্লিকেশনটি ক্র্যাশ করবে না।
// এটি ভালো প্রোগ্রামিং অভ্যাস এবং বটকে স্থিতিশীল রাখতে সাহায্য করে।
process.on('uncaughtException', (error) => {
  console.error('❌ একটি অপ্রত্যাশিত ত্রুটি ঘটেছে (Uncaught Exception):', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ একটি Promise ত্রুটি ঘটেছে (Unhandled Rejection):', reason);
});