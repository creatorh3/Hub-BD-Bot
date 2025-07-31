// web/server.js

const express = require('express');
const createRouter = require('./routes');

function startServer(bot) {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(express.json());

  // স্বাস্থ্য পরীক্ষার জন্য একটি রুট (Render এটি পছন্দ করে)
  app.get('/', (req, res) => {
    res.send('Hub BD Bot server is running!');
  });
  
  // বট অবজেক্ট সহ রাউটার সেটআপ করা
  const botRouter = createRouter(bot);
  app.use('/api', botRouter);

  app.listen(port, () => {
    console.log(`Web server listening on port ${port}`);
  });
}

module.exports = { startServer };