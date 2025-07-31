// bot_controller.js
const config = require('./config');
const constants = require('./constants');
const firebase = require('./services/firebase_service');

class BotController {
  constructor(bot) {
    this.bot = bot;
  }

  listen() {
    this.bot.onText(/\/start(?: (.+))?/, (msg, match) => this.handleStart(msg, match));
    this.bot.on('message', (msg) => this.handleMessage(msg));
  }

  async handleStart(msg, match) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const name = msg.from.first_name || 'User';
    const referrerId = match ? match[1] : null;

    try {
      await firebase.findOrCreateUser(userId, name);
      if (referrerId && referrerId !== String(userId)) {
        await firebase.incrementReferralData(referrerId, config.referralBonus);
        this.bot.sendMessage(referrerId, `অভিনন্দন! ${name} আপনার রেফারে জয়েন করেছে। আপনি ${config.referralBonus} টাকা বোনাস পেয়েছেন।`)
            .catch(e => console.error(`Could not notify referrer ${referrerId}`));
      }

      const welcomeText = constants.messages.welcome(name);
      const keyboard = {
        reply_markup: {
          keyboard: [
            [{ text: constants.buttons.openWeb, web_app: { url: config.links.miniAppLink } }],
            [{ text: constants.buttons.viralVideo }, { text: constants.buttons.referAndEarn }],
            [{ text: constants.buttons.withdraw }, { text: constants.buttons.leaderboard }],
          ], resize_keyboard: true,
        },
      };

      await this.bot.sendPhoto(chatId, config.links.welcomeImage, { caption: welcomeText, ...keyboard });
    } catch (error) {
      console.error('Error in handleStart:', error);
      this.bot.sendMessage(chatId, constants.messages.generalError);
    }
  }

  async handleMessage(msg) {
    if (!msg.text || msg.text.startsWith('/start')) return;
    const chatId = msg.chat.id;
    const userId = msg.from.id;

    try {
      const user = await firebase.findOrCreateUser(userId, msg.from.first_name);

      switch (msg.text) {
        case constants.buttons.referAndEarn:
          const referralLink = `https://t.me/${config.botUsername}?start=${userId}`;
          const referralText = constants.messages.referralInfo(user.totalReferralCount, user.balance, referralLink);
          this.bot.sendMessage(chatId, referralText, { parse_mode: 'Markdown' });
          break;

        case constants.buttons.viralVideo:
          const required = config.referralsNeededForDownload;
          const current = user.totalReferralCount;
          if (current >= required) {
            this.bot.sendMessage(chatId, constants.messages.referralGoalReached, {
              reply_markup: { inline_keyboard: [[{ text: constants.messages.downloadButtonText, url: config.links.downloadLink }]] }
            });
          } else {
            const prompt = constants.messages.viralVideoPrompt(required, current);
            this.bot.sendPhoto(chatId, config.links.viralVideoImage, { caption: prompt, parse_mode: 'Markdown' });
          }
          break;

        case constants.buttons.withdraw:
          this.bot.sendMessage(chatId, constants.messages.withdrawInfo(user.balance), { parse_mode: 'Markdown' });
          break;
          
        case constants.buttons.leaderboard:
          const users = await firebase.getLeaderboardUsers();
          if (users.length === 0) {
            return this.bot.sendMessage(chatId, constants.messages.leaderboardNotAvailable);
          }
          let leaderboardText = constants.messages.leaderboardHeader;
          users.forEach((u, i) => {
            leaderboardText += `${i + 1}. *${u.name}* - ${u.weeklyReferralCount} টি রেফার\n`;
          });
          leaderboardText += constants.messages.leaderboardFooter;
          this.bot.sendMessage(chatId, leaderboardText, { parse_mode: 'Markdown' });
          break;
      }
    } catch (error) {
      console.error('Error in handleMessage:', error);
      this.bot.sendMessage(chatId, constants.messages.generalError);
    }
  }
}
module.exports = BotController;