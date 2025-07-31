// config.js

module.exports = {
  // --- গোপন তথ্য (এগুলো Render-এর Environment Variables-এ রাখবেন) ---
  botToken: process.env.BOT_TOKEN || '7788588841:AAHLjY9T-w1aYYFQqANnqOM7LRiGSqJS9Bc',
  cronSecret: process.env.CRON_SECRET || 'HubBD-WeeklyReward-xYz-789!@#',

  // --- লিঙ্ক ও মিডিয়া ---
  welcomeImage: 'https://i.postimg.cc/RZJLjTJ9/retouch-2025073115005700.jpg',
  viralVideoImage: 'https://i.postimg.cc/WbsVDL3h/20250731-122806.jpg',
  downloadLink: 'https://amhubltd.blogspot.com',
  miniAppLink: 'http://t.me/HubCoin_minerbot?startapp',
  botUsername: 'Watermelonvideo_bot', // আপনার বটের ইউজারনেম (লিঙ্ক তৈরির জন্য)

  // --- ব্যবসার নিয়মকানুন (Business Logic) ---
  referralBonus: 25,     // প্রতি রেফারে কত টাকা বোনাস
  referralsNeededForDownload: 5, // ডাউনলোডের জন্য প্রয়োজনীয় রেফার সংখ্যা

  // --- উইথড্র সেটিংস ---
  withdrawalMethods: ['BKash', 'Nagad', 'Ton'],
  minWithdrawalAmounts: [500, 1000, 1500, 2500],
};