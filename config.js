// config.js
require('dotenv').config(); // লোকালে .env ফাইল থেকে তথ্য পড়ার জন্য

module.exports = {
  // --- গোপন তথ্য (Render-এর Environment Variables থেকে আসবে) ---
  botToken: process.env.BOT_TOKEN,
  cronSecret: process.env.CRON_SECRET,
  firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,

  // --- লিঙ্ক ও মিডিয়া ---
  links: {
    welcomeImage: 'https://i.postimg.cc/RZJLjTJ9/retouch-2025073115005700.jpg',
    viralVideoImage: 'https://i.postimg.cc/WbsVDL3h/20250731-122806.jpg',
    downloadLink: 'https://amhubltd.blogspot.com',
    miniAppLink: 'http://t.me/HubCoin_minerbot?startapp',
  },
  
  botUsername: 'Watermelonvideo_bot', // আপনার বটের ইউজারনেম (লিঙ্ক তৈরির জন্য)

  // --- ব্যবসার নিয়মকানুন (Business Logic) ---
  referralBonus: 25,
  referralsNeededForDownload: 5,
  
  leaderboardRewards: {
    top1: 10,
    top2: 5,
    top3: 2,
    rank4to10: 0.5,
  },
  
  // --- উইথড্র সেটিংস ---
  withdrawalMethods: ['BKash', 'Nagad', 'Ton'],
  minWithdrawalAmounts: [500, 1000, 1500, 2500],
};