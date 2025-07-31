// config.js

// .env ফাইল লোড করার জন্য (এটি আপনার নিজের কম্পিউটারে বট চালানোর সময় কাজে লাগবে)
require('dotenv').config();

module.exports = {
  // --- গোপন তথ্য (এইগুলো Render-এর Environment Variables থেকে লোড হবে) ---
  // সরাসরি এখানে কোনো গোপন টোকেন বা কী লিখবেন না।
  botToken: process.env.BOT_TOKEN,
  cronSecret: process.env.CRON_SECRET,
  firebaseServiceAccount: process.env.FIREBASE_SERVICE_ACCOUNT,

  // --- লিঙ্ক ও মিডিয়া ---
  links: {
    welcomeImage: 'https://i.postimg.cc/RZJLjTJ9/retouch-2025_07_31_15_00_57_00.jpg',
    viralVideoImage: 'https://i.postimg.cc/WbsVDL3h/20250731_122806.jpg',
    downloadLink: 'https://amhubltd.blogspot.com',
    // FIX: http:// কে https:// করা হয়েছে
    miniAppLink: 'https://t.me/HubCoin_minerbot?startapp',
  },
  
  // --- সাধারণ সেটিংস ---
  botUsername: 'Watermelonvideo_bot', // আপনার বটের ইউজারনেম (রেফারেল লিঙ্ক তৈরির জন্য)

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