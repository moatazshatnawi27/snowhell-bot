const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
module.exports = {
    name: 'points',
    execute(message) {
        const data = JSON.parse(fs.readFileSync('./points.json', 'utf8'));
        const embed = new EmbedBuilder()
            .setTitle('🏆 لوحة صدارة الفرق')
            .setColor('#00FFFF')
            .addFields(
                { name: '❄️ فريق Snow', value: `**${data.Snow}** نقطة`, inline: true },
                { name: '🔥 فريق Hell', value: `**${data.Hell}** نقطة`, inline: true }
            );
        message.channel.send({ embeds: [embed] });
    }
};