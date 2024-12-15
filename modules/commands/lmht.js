const fs = require('fs');

module.exports.config = {
    name: "lmht",
    version: "1.0.0",
    hasPermssion: 0,
    usePrefix: false,
    credits: "Procode hiếu",
    description: "Xem thông tin tướng trong Liên Minh Huyền Thoại",
    commandCategory: "Tiện ích",
    usages: "<tên tướng>",
    cooldowns: 5,
    dependencies: {}
};

const champions = JSON.parse(fs.readFileSync('./modules/commands/Game/lmht.json', 'utf8'));

module.exports.run = async function({ api, event, args }) {
    const championName = args.join(" ");
    const champion = champions.find(c => c.name.toLowerCase() === championName.toLowerCase());

    if (!champion) {
        return api.sendMessage("Tướng không tìm thấy. Vui lòng kiểm tra lại tên tướng.", event.threadID);
    }

    const message = `Thông tin tướng ${champion.name}\n` +
                    `HP: ${champion.hp}\n` +
                    `HP tăng mỗi cấp: ${champion.hp_gain_per_lvl}\n` +
                    `Hồi phục HP: ${champion.hp_regen}\n` +
                    `Hồi phục HP mỗi cấp: ${champion.hp_regen_gain_per_lvl}\n` +
                    `Mana: ${champion.mana}\n` +
                    `Mana tăng mỗi cấp: ${champion.mana_gain_per_lvl}\n` +
                    `ồi phục Mana: ${champion.mana_regen}\n` +
                    `Hồi phục Mana mỗi cấp: ${champion.mana_regen_gain_per_lvl}\n` +
                    `Sát thương: ${champion.attack_damage}\n` +
                    `Sát thương tăng mỗi cấp: ${champion.attack_damage_gain_per_lvl}\n` +
                    `Tốc độ đánh: ${champion.attack_speed}\n` +
                    `Tốc độ đánh tăng mỗi cấp: ${champion.attack_speed_gain_per_lvl}\n` +
                    `Giáp: ${champion.armor}\n` +
                    `Giáp tăng mỗi cấp: ${champion.armor_gain_per_lvl}\n` +
                    `Kháng phép: ${champion.magic_resist}\n` +
                    `Kháng phép tăng mỗi cấp: ${champion.magic_resist_gain_per_lvl}\n` +
                    `Tốc độ di chuyển: ${champion.movement_speed}\n` +
                    `Tầm đánh: ${champion.range}\n` +
                    `Sát thương phép: ${champion.ability_power}\n` +
                    `Tăng tốc kỹ năng: ${champion.ability_haste}\n` +
                    `Tỉ lệ chí mạng: ${champion.crit}\n` +
                    `Hình ảnh: ${champion.images}`;

    api.sendMessage(message, event.threadID);
};
