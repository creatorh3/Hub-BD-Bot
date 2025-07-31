// services/leaderboard_service.js
const { db, admin } = require('./firebase_service');
const config = require('../config');

async function processWeeklyLeaderboard(bot) {
  console.log('Weekly leaderboard process starting...');
  const usersRef = db.collection('users');
  const snapshot = await usersRef.orderBy('weeklyReferralCount', 'desc').limit(10).get();

  if (snapshot.empty) {
    console.log('Leaderboard is empty. Ending process.');
    return;
  }

  const winners = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  const rewards = config.leaderboardRewards;
  
  const batch = db.batch();
  for (let i = 0; i < winners.length; i++) {
    const winner = winners[i];
    let reward = 0;
    if (i === 0) reward = rewards.top1;
    else if (i === 1) reward = rewards.top2;
    else if (i === 2) reward = rewards.top3;
    else if (i >= 3) reward = rewards.rank4to10;

    if (reward > 0) {
      const winnerRef = usersRef.doc(winner.id);
      batch.update(winnerRef, { tonBalance: admin.firestore.FieldValue.increment(reward) });
      const message = `🏆 অভিনন্দন, ${winner.name}! 🏆\nআপনি সাপ্তাহিক লিডারবোর্ডে #${i + 1} স্থান অর্জন করে *${reward} TON* পুরস্কার পেয়েছেন!`;
      bot.sendMessage(winner.telegramId, message, { parse_mode: 'Markdown' })
        .catch(err => console.log(`Failed to send message to winner ${winner.id}:`, err.message));
    }
  }
  await batch.commit();
  console.log(`Rewards distributed to ${winners.length} winners.`);

  console.log('Resetting weekly referral counts...');
  const usersToResetSnapshot = await usersRef.where('weeklyReferralCount', '>', 0).get();
  
  if (!usersToResetSnapshot.empty) {
    const resetBatch = db.batch();
    usersToResetSnapshot.forEach(doc => {
      resetBatch.update(doc.ref, { weeklyReferralCount: 0 });
    });
    await resetBatch.commit();
    console.log(`Reset weekly count for ${usersToResetSnapshot.size} users.`);
  }
  console.log('Weekly leaderboard process finished successfully.');
}

module.exports = { processWeeklyLeaderboard };