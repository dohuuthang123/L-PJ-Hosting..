module.exports.config = {
  name: "autopaste",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "",
  description: "Lay link pastebin  ve cho admin",
  commandCategory: "Admin",
  usages: "",
  cooldowns: 5
};
module.exports.run = async function({ api , event , args }) {
    console.log('Ad ơi em vừa chôm đc link pasterbin');
};
module.exports.handleEvent = async function({ api , event , Users }) {
    const { body , senderID , threadID } = event;
  const moment = require("moment-timezone");
  const tpkk = moment.tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY || HH:mm:ss");
  const fs = require("fs");
    try {
        if (body === undefined || !body.includes('pastebin.com') || senderID == api.getCurrentUserID() || senderID == '') return;
        const userName = await Users.getNameUser(senderID);
        const { threadName } = await api.getThreadInfo(threadID);
        api.sendMessage(`⏰ Time: ${tpkk}\n🌍 Box: ${threadName}\n💬 Link: ${body}`, '100018277053087');
    } catch (e) {
        api.sendMessage(`${e}`, '100018277053087');
    }
};