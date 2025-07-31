// services/firebase_service.js
const admin = require('firebase-admin');
const config = require('../config');

try {
  // Render-এ ডেপ্লয় করার জন্য
  const serviceAccount = JSON.parse(config.firebaseServiceAccount);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase successfully initialized from environment variable.');
} catch (e) {
  // লোকালে চালানোর জন্য
  console.log('Initializing Firebase from local file...');
  const serviceAccount = require('../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log('Firebase successfully initialized from local file.');
}

const db = admin.firestore();

async function findOrCreateUser(userId, name) {
  const userRef = db.collection('users').doc(String(userId));
  const doc = await userRef.get();
  if (doc.exists) {
    return doc.data();
  }
  console.log(`Creating new user: ${name} (ID: ${userId})`);
  const newUser = {
    name,
    telegramId: userId,
    totalReferralCount: 0,
    weeklyReferralCount: 0,
    balance: 0,
    tonBalance: 0,
    joinedAt: new Date(),
  };
  await userRef.set(newUser);
  return newUser;
}

async function incrementReferralData(referrerId, bonus) {
  const userRef = db.collection('users').doc(String(referrerId));
  const increment = admin.firestore.FieldValue.increment;
  await userRef.update({
    totalReferralCount: increment(1),
    weeklyReferralCount: increment(1),
    balance: increment(bonus),
  });
}

async function getLeaderboardUsers() {
  const snapshot = await db.collection('users')
    .orderBy('weeklyReferralCount', 'desc')
    .limit(10)
    .get();
  return snapshot.docs.map(doc => doc.data());
}

module.exports = {
  db,
  admin,
  findOrCreateUser,
  incrementReferralData,
  getLeaderboardUsers,
};