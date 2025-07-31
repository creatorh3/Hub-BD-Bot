// constants.js
module.exports = {
  // --- মেনু বাটন ---
  buttons: {
    openWeb: '🚀 Open Web App',
    viralVideo: '🎬 Viral Video',
    referAndEarn: '👥 Refer & Earn 25৳',
    withdraw: '💰 Withdraw',
    leaderboard: '🏆 Leaderboard',
  },

  // --- বার্তা ---
  messages: {
    welcome: (name) => `👋 হ্যালো ${name},\nHub BD বটে আপনাকে স্বাগতম! নিচের বাটনগুলো থেকে আপনার পছন্দের অপশনটি বেছে নিন।`,

    referralInfo: (referralCount, balance, referralLink) =>
      `আপনি সফলভাবে *${referralCount}* জনকে রেফার করেছেন।\n\n` +
      `💵 আপনার বর্তমান ব্যালেন্স: *${balance} BDT*\n\n` +
      `🔗 আপনার রেফারেল লিঙ্ক:\n\`${referralLink}\`\n\n` +
      `এই লিঙ্কটি বন্ধুদের সাথে শেয়ার করুন। প্রতি সফল রেফারে আপনি পাবেন ২৫ টাকা বোনাস!`,

    withdrawInfo: (balance) => `আপনার বর্তমান ব্যালেন্স: *${balance} BDT*\n\n` + `টাকা তোলার ফিচারটি এখন নির্মাণাধীন আছে।`,

    leaderboardHeader: '🏆 সাপ্তাহিক লিডারবোর্ড 🏆\nসেরা ১০ জন ব্যবহারকারী:\n\n',
    leaderboardEntry: (rank, name, count) => `${rank}. *${name}* - ${count} টি রেফার`,
    leaderboardFooter: '\nপ্রতি রবিবার রাতে লিডারবোর্ড রিসেট করা হয় এবং বিজয়ীদের পুরস্কার দেওয়া হয়।',
    leaderboardNotAvailable: 'এখনও লিডারবোর্ড তৈরি হয়নি। রেফার করা শুরু করুন!',
    
    // --- ভাইরাল ভিডিও সেকশন ---
    viralVideoPrompt: (required, current) => `এই ভিডিওটি ডাউনলোড করতে আপনার *${required}* টি রেফার প্রয়োজন।\n\n` + `আপনার বর্তমান রেফার সংখ্যা: *${current}* টি।`,
    downloadButtonText: '📥 Download Video File',
    referralGoalReached: 'অভিনন্দন! আপনি সফলভাবে আপনার রেফারেল লক্ষ্য পূরণ করেছেন। নিচের লিঙ্কে ক্লিক করে ফাইলটি ডাউনলোড করুন।',
    
    // --- এরর বার্তা ---
    generalError: 'দুঃখিত, একটি সমস্যা হয়েছে। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।',
  },
};