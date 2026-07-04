const { EmbedBuilder } = require('discord.js');
module.exports = {
    name: 'gstart',
    execute(message, args) {
        const durationStr = args[0], winners = args[1], prize = args.slice(2).join(" ");
        if (!durationStr || !winners || !prize) return message.reply('الاستخدام: `.gstart 1d 1 الجائزة`');
        let ms = durationStr.endsWith('d') ? parseInt(durationStr) * 86400000 : parseInt(durationStr) * 60000;
        const endTime = new Date(Date.now() + ms);
        const embed = new EmbedBuilder().setTitle(`🎁 ${prize}`).setDescription(`● **Ends:** <t:${Math.floor(endTime.getTime() / 1000)}:R>`);
        message.channel.send({ embeds: [embed] }).then(msg => msg.react('🎉'));
    }
};
