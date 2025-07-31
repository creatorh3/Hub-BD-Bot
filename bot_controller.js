// bot_controller.js

const config = require('./config');
const constants = require('./constants');
const firebaseService = require('./services/firebase_service');

class BotController {
  constructor(bot) {
    this.bot = bot;
  }

  // เริ่มรอรับข้อความและ event ต่างๆ
  listen() {
    this.bot.onText(/\/start(?: (.+))?/, (msg, match) => this.handleStart(msg, match));
    this.bot.on('message', (msg) => this.handleMessage(msg));
  }

  // จัดการคำสั่ง /start
  async handleStart(msg, match) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const name = msg.from.first_name || 'ผู้ใช้';
    const referrerId = match[1]; // ID ของผู้แนะนำ (ถ้ามี)

    try {
      // ค้นหาหรือสร้างผู้ใช้ใหม่
      await firebaseService.findOrCreateUser(userId, name);
      
      // ตรวจสอบว่ามีผู้แนะนำหรือไม่ และผู้แนะนำไม่ใช่ตัวเอง
      if (referrerId && referrerId !== String(userId)) {
        // เพิ่มคะแนนให้ผู้แนะนำ
        await firebaseService.incrementReferral(referrerId, config.referralBonus);
        console.log(`ผู้ใช้ ${userId} เข้าร่วมผ่านการแนะนำของ ${referrerId}`);
        // อาจจะส่งข้อความแจ้งเตือนไปให้ผู้แนะนำ
        this.bot.sendMessage(referrerId, `ยินดีด้วย! มีคนเข้าร่วมผ่านลิงก์ของคุณ และคุณได้รับ ${config.referralBonus} BDT`);
      }

      const welcomeText = constants.welcomeMessage(name);
      const options = {
        reply_markup: {
          keyboard: [
            [{ text: constants.mainMenu.openWeb }],
            [{ text: constants.mainMenu.viralVideo }, { text: constants.mainMenu.referral }],
            [{ text: constants.mainMenu.withdraw }, { text: constants.mainMenu.leaderboard }],
          ],
          resize_keyboard: true,
        },
      };
      
      // ส่งรูปภาพต้อนรับพร้อมกับเมนู
      this.bot.sendPhoto(chatId, config.welcomeImage, {
        caption: welcomeText,
        ...options,
      });

    } catch (error) {
      console.error('เกิดข้อผิดพลาดที่ handleStart:', error);
      this.bot.sendMessage(chatId, 'เกิดข้อผิดพลาดบางอย่าง โปรดลองอีกครั้ง');
    }
  }

  // จัดการข้อความทั่วไปและปุ่มเมนู
  async handleMessage(msg) {
    const chatId = msg.chat.id;
    const userId = msg.from.id;
    const text = msg.text;

    // ไม่สนใจคำสั่ง /start เพราะจัดการไปแล้ว
    if (text && text.startsWith('/start')) {
      return;
    }

    try {
      const user = await firebaseService.findOrCreateUser(userId, msg.from.first_name);
      if (!user) {
        return this.bot.sendMessage(chatId, 'ไม่พบข้อมูลของคุณ โปรดพิมพ์ /start เพื่อเริ่มต้น');
      }

      switch (text) {
        case constants.mainMenu.openWeb:
          // จัดการปุ่ม Open Web App
          this.bot.sendMessage(chatId, `คลิกที่นี่เพื่อเปิดแอป: ${config.miniAppLink}`);
          break;
        
        case constants.mainMenu.viralVideo:
          // จัดการปุ่ม Viral Video
          await this.handleViralVideo(chatId, user);
          break;
        
        case constants.mainMenu.referral:
          // จัดการปุ่ม Refer & Earn
          const referralLink = `https://t.me/${config.botUsername}?start=${userId}`;
          const referralText = constants.referralInfo(user.totalReferralCount, user.balance, referralLink);
          this.bot.sendMessage(chatId, referralText, { parse_mode: 'Markdown' });
          break;

        case constants.mainMenu.withdraw:
          // จัดการปุ่ม Withdraw
          const withdrawText = constants.withdrawInfo(user.balance);
          this.bot.sendMessage(chatId, withdrawText, { parse_mode: 'Markdown' });
          // เพิ่มโค้ดสำหรับแสดงปุ่มช่องทางการถอนเงิน
          break;

        case constants.mainMenu.leaderboard:
          // จัดการปุ่ม Leaderboard
          await this.handleLeaderboard(chatId);
          break;

        default:
          // จัดการข้อความอื่นๆ ที่ไม่ตรงกับเมนู
          // this.bot.sendMessage(chatId, 'โปรดเลือกเมนูด้านล่าง');
          break;
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดที่ handleMessage:', error);
    }
  }

  // จัดการส่วน Viral Video
  async handleViralVideo(chatId, user) {
    const required = config.referralsNeededForDownload;
    const current = user.totalReferralCount;

    if (current >= required) {
      // ถ้าแนะนำครบแล้ว
      this.bot.sendMessage(chatId, constants.referralGoalReached, {
        reply_markup: {
          inline_keyboard: [
            [{ text: constants.downloadButtonText, url: config.downloadLink }],
          ],
        },
      });
    } else {
      // ถ้ายังแนะนำไม่ครบ
      const prompt = constants.viralVideoPrompt
        .replace('{REQUIRED}', required)
        .replace('{CURRENT}', current);

      this.bot.sendPhoto(chatId, config.viralVideoImage, {
        caption: prompt,
        parse_mode: 'Markdown',
      });
    }
  }

  // จัดการส่วน Leaderboard
  async handleLeaderboard(chatId) {
    const leaderboardData = await firebaseService.getLeaderboard();
    
    if (leaderboardData.length === 0) {
      return this.bot.sendMessage(chatId, 'ยังไม่มีข้อมูลในลีดเดอร์บอร์ด');
    }

    let message = constants.leaderboardHeader;
    leaderboardData.forEach((user, index) => {
      message += `${index + 1}. *${user.name}* - ${user.weeklyReferralCount} คน\n`;
    });

    this.bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
}

module.exports = BotController;