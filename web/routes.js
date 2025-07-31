// web/routes.js

const express = require('express');
const router = express.Router();
const config = require('../config');
const { processWeeklyLeaderboard } = require('../services/leaderboard_service');

// এই ফাংশনটি bot অবজেক্টটিকে গ্রহণ করে যাতে লিডারবোর্ড সার্ভিস বিজয়ীদের নোটিফিকেশন পাঠাতে পারে
module.exports = (bot) => {
  // Cron Job কল করার জন্য রুট। যেমন: https://your-app.onrender.com/api/run-leaderboard
  router.post('/run-leaderboard', async (req, res) => {
    const providedSecret = req.headers['x-cron-secret'];

    // নিরাপত্তা যাচাই: হেডার থেকে পাওয়া গোপন কী এবং config ফাইলের কী এক কিনা তা পরীক্ষা করা হচ্ছে
    if (providedSecret !== config.cronSecret) {
      console.warn('Unauthorized cron job attempt detected with incorrect secret.');
      return res.status(401).send({ error: 'Unauthorized' });
    }

    try {
      console.log('Cron Job request received. Starting leaderboard cycle...');
      // মূল কাজটি করার জন্য লিডারবোর্ড সার্ভিসকে বলা হচ্ছে
      await processWeeklyLeaderboard(bot);
      console.log('Cron Job finished successfully.');
      res.status(200).send({ message: 'Leaderboard process completed successfully.' });
    } catch (error) {
      console.error('FATAL: A critical error occurred during the cron job execution:', error);
      res.status(500).send({ error: 'Internal Server Error during cron job.' });
    }
  });

  return router;
};