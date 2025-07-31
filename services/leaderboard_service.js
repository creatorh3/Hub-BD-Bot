// services/leaderboard_service.js

const { db } = require('./firebase_service');
const config = require('../config');

// পুরস্কার বিতরণের মূল লজিক
async function processWeeklyLeaderboard(bot) {
  console.log('সাপ্তাহিক লিডারবোর্ড প্রক্রিয়া শুরু হচ্ছে...');

  const usersRef = db.collection('users');
  const snapshot = await usersRef.orderBy('weeklyReferralCount', 'desc').limit(10).get();

  if (snapshot.empty) {
    console.log('লিডারবোর্ডে কোনো ব্যবহারকারী নেই। প্রক্রিয়া শেষ।');
    return;
  }

  const winners = [];
  snapshot.forEach(doc => {
    winners.push({ id: doc.id, ...doc.data() });
  });

  // ১. বিজয়ীদের পুরস্কার দেওয়া এবং নোটিফিকেশন পাঠানো
  const batch = db.batch();
  for (let i = 0; i < winners.length; i++) {
    const winner = winners[i];
    let reward = 0;

    if (i === 0) reward = 10; // Top 1
    else if (i === 1) reward = 5;  // Top 2
    else if (i === 2) reward = 2;  // Top 3
    else if (i >= 3 && i < 10) reward = 0.5; // Top 4-10

    if (reward > 0) {
      const winnerRef = usersRef.doc(winner.id);
      batch.update(winnerRef, { tonBalance: admin.firestore.FieldValue.increment(reward) });
      
      // বিজয়ীকে অভিনন্দন বার্তা পাঠানো
      const message = `🏆 অভিনন্দন, ${winner.name}! 🏆\nআপনি সাপ্তাহিক লিডারবোর্ডে #${i + 1} স্থান অর্জন করে *${reward} TON* পুরস্কার পেয়েছেন!`;
      bot.sendMessage(winner.id, message, { parse_mode: 'Markdown' }).catch(err => {
        console.log(`বিজয়ীকে (${winner.id}) বার্তা পাঠাতে ব্যর্থ:`, err.message);
      });
    }
  }
  await batch.commit();
  console.log(`${winners.length} জন বিজয়ীকে পুরস্কার দেওয়া হয়েছে।`);

  // ২. লিডারবোর্ড রিসেট করা
  console.log('সবার সাপ্তাহিক রেফারেল সংখ্যা রিসেট করা হচ্ছে...');
  const usersToResetSnapshot = await usersRef.where('weeklyReferralCount', '>', 0).get();
  
  if (!usersToResetSnapshot.empty) {
    const resetBatch = db.batch();
    usersToResetSnapshot.forEach(doc => {
      resetBatch.update(doc.ref, { weeklyReferralCount: 0 });
    });
    await resetBatch.commit();
    console.log(`${usersToResetSnapshot.size} জন ব্যবহারকারীর লিডারবোর্ড রিসেট করা হয়েছে।`);
  }

  console.log('সাপ্তাহিক লিডারবোর্ড প্রক্রিয়া সফলভাবে শেষ হয়েছে।');
}

module.exports = { processWeeklyLeaderboard };