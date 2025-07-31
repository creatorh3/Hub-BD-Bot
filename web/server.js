// web/server.js

const express = require('express');
const createRouter = require('./routes');

function startServer(bot) {
  const app = express();
  // Render তার নিজস্ব PORT এনভায়রনমেন্ট ভেরিয়েবলের মাধ্যমে পোর্ট সরবরাহ করে
  const port = process.env.PORT || 3000;

  // Render সার্ভারটি চালু আছে কিনা তা পরীক্ষা করার জন্য এই রুটটি খুব দরকারি
  app.get('/', (req, res) => {
    res.status(200).send('Hub BD Bot server is alive and running!');
  });
  
  // রাউটারকে '/api' পাথের অধীনে যুক্ত করা হচ্ছে
  // এর মানে হলো, Cron Job-এর রুটটি হবে: /api/run-leaderboard
  app.use('/api', createRouter(bot));

  app.listen(port, () => {
    console.log(`✅ Web server is listening on port ${port}`);
  });
}

module.exports = { startServer };