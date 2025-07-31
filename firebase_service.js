**গুরুত্বপূর্ণ:** আপনার ডাউনলোড করা `serviceAccountKey.json` ফাইলটি প্রজেক্টের এই মূল ফোল্ডারেই রাখবেন।

---

### ধাপ ৪: `services/firebase_service.js` (ডেটা ম্যানেজার)

এই ফাইলটি Firebase সম্পর্কিত সব কাজ পরিচালনা করবে।

```javascript
// services/firebase_service.js

const admin = require('firebase-admin');

// Firebase শুরু করা হচ্ছে
try {
  const serviceAccount = require('../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
} catch (error) {
  console.error("Firebase Admin SDK শুরু করা যায়নি। serviceAccountKey.json ফাইলটি ঠিক আছে কিনা দেখুন।");
  process.exit(1);
}

const db = admin.firestore();
const usersCollection = db.collection('users');

/**
 * একজন ব্যবহারকারীকে খুঁজে বের করে বা নতুন হলে তৈরি করে।
 * @param {number} userId - টেলিগ্রাম ইউজার আইডি
 * @param {string} name - ব্যবহারকারীর নাম
 * @returns {object} ব্যবহারকারীর ডেটা
 */
async function findOrCreateUser(userId, name) {
  const userRef = usersCollection.doc(String(userId));
  const doc = await userRef.get();

  if (!doc.exists) {
    console.log(`নতুন ব্যবহারকারী তৈরি হচ্ছে: ${name} (${userId})`);
    const newUser = {
      name: name,
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
  return doc.data();
}

/**
 * একজন ব্যবহারকারীর রেফারেল সংখ্যা এবং ব্যালেন্স বাড়ায়।
 * @param {number} referrerId - যিনি রেফার করেছেন তার আইডি
 * @param {number} bonus - বোনাসের পরিমাণ
 */
async function incrementReferral(referrerId, bonus) {
  const userRef = usersCollection.doc(String(referrerId));
  const increment = admin.firestore.FieldValue.increment;

  await userRef.update({
    totalReferralCount: increment(1),
    weeklyReferralCount: increment(1),
    balance: increment(bonus),
  });
}

/**
 * লিডারবোর্ডের জন্য সেরা ব্যবহারকারীদের তালিকা আনে।
 * @returns {Array} সেরা ব্যবহারকারীদের তালিকা
 */
async function getLeaderboard() {
  const snapshot = await usersCollection
    .orderBy('weeklyReferralCount', 'desc')
    .limit(10)
    .get();
    
  if (snapshot.empty) {
    return [];
  }

  const leaderboard = [];
  snapshot.forEach(doc => {
    leaderboard.push(doc.data());
  });

  return leaderboard;
}


module.exports = {
  db,
  findOrCreateUser,
  incrementReferral,
  getLeaderboard,
};