const axios = require("axios");

module.exports.config = {
    name: "out",
    version: "1.0.0",
    hasPermssion: 2,
    credits: "DũngUwU",
    description: "out box",
    commandCategory: "Admin",
    usages: "[tid]",
    cooldowns: 3,
    usePrefix: true // Added the usePrefix option
};

module.exports.run = async function({ api, event, args }) {
    const imageList = [
        "https://i.imgur.com/FOd3rpr.jpg",
        "https://i.imgur.com/wwMd3rF.jpg",
        "https://i.imgur.com/0xfzAtw.jpg",
        "https://i.imgur.com/x9HpJ04.jpg",
        "https://i.imgur.com/ZweZwbu.jpg",
        "https://i.imgur.com/3R1Xe3H.jpg",
        "https://i.imgur.com/rT7xQch.jpg",
        "https://i.imgur.com/pN1bX0P.jpg"
    ];
    
    const imageUrl = imageList[Math.floor(Math.random() * imageList.length)];
    const attachment = (await axios.get(imageUrl, { responseType: "stream" })).data;
    
    const permission = ["100018277053087"];
    if (!permission.includes(event.senderID)) {
        return api.sendMessage(
            { body: "Xin cái tuổi để out?", attachment },
            event.threadID,
            event.messageID
        );
    }

    const id = args.length ? parseInt(args.join(" ")) : event.threadID;
    api.sendMessage(
        { body: 'Đã nhận lệnh out nhóm từ admin!', attachment },
        id,
        () => api.removeUserFromGroup(api.getCurrentUserID(), id)
    );
};
