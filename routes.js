// web/routes.js

const express = require('express');
const router = express.Router();
const config = require('../config');
const { processWeeklyLeaderboard } = require('../services/leaderboard_service');

// এই ফাংশনটি bot অবজেক্টটিকে রিসিভ করবে
const createRouter = (bot) => {
  // Cron Job কল করার জন্য গোপন রুট
  router.post('/cron/run-leaderboard', async (req, res) => {
    // নিরাপত্তা যাচাই: হেডার থেকে গোপন কী চেক করা হচ্ছে
    const providedSecret = req.headers['x-cron-secret'];
    if (providedSecret !== config.cronSecret) {
      console.warn('অবৈধ Cron Job কল শনাক্ত হয়েছে।');
      return res.status(401).send('Unauthorized');
    }

    try {
      await processWeeklyLeaderboard(bot);
      res.status(200).send('Leaderboard process triggered successfully.');
    } catch (error) {
      console.error('Cron Job চালাতে গিয়ে মারাত্মক ত্রুটি:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  return router;
};

module.exports = createRouter;