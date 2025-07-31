// constants.js

module.exports = {
  // --- মেনু বাটন ---
  mainMenu: {
    openWeb: '🚀 Open Web App',
    viralVideo: '🎬 Viral Video',
    referral: '👥 Refer & Earn 25৳',
    withdraw: '💰 Withdraw',
    leaderboard: '🏆 Leaderboard',
  },

  // --- বার্তা ---
  welcomeMessage: (name) => `👋 হ্যালো ${name},\nHub BD বটে আপনাকে স্বাগতম! নিচের বাটনগুলো থেকে আপনার পছন্দের অপশনটি বেছে নিন।`,

  referralInfo: (referralCount, balance, referralLink) =>
    `আপনি সফলভাবে *${referralCount}* জনকে রেফার করেছেন।\n\n` +
    `💵 আপনার বর্তমান ব্যালেন্স: *${balance} BDT*\n\n` +
    `🔗 আপনার রেফারেল লিঙ্ক:\n${referralLink}\n\n` +
    `এই লিঙ্কটি বন্ধুদের সাথে শেয়ার করুন। প্রতি সফল রেফারে আপনি পাবেন ২৫ টাকা বোনাস!`,

  withdrawInfo: (balance) => `আপনার বর্তমান ব্যালেন্স: *${balance} BDT*\n\n` +
    `টাকা তোলার জন্য একটি মাধ্যম বেছে নিন।`,

  leaderboardHeader: '🏆 সাপ্তাহিক লিডারবোর্ড 🏆\nসেরা ১০ জন ব্যবহারকারী:\n\n',

  // --- ভাইরাল ভিডিও সেকশন ---
  viralVideoPrompt: (required, current) => `এই ভিডিওটি ডাউনলোড করতে আপনার *${required}* টি রেফার প্রয়োজন।\n\n` +
    `আপনার বর্তমান রেফার সংখ্যা: *${current}* টি।`,

  downloadButtonText: '📥 Download Video File',

  referralGoalReached: 'অভিনন্দন! আপনি সফলভাবে আপনার রেফারেল লক্ষ্য পূরণ করেছেন। নিচের লিঙ্কে ক্লিক করে ফাইলটি ডাউনলোড করুন।',
};