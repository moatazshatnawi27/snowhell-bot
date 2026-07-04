const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ticket',
    execute(message, args) {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('create_ticket').setLabel('فتح تيكيت 🎫').setStyle(ButtonStyle.Success)
        );
        message.channel.send({ content: 'اضغط على الزر لفتح تيكيت جديد:', components: [row] });
    }
};