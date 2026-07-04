const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'welcome',
    execute(message, args) {
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('snow')
                    .setLabel('Snow')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('hell')
                    .setLabel('Hell')
                    .setStyle(ButtonStyle.Danger),
            );

        message.reply({ 
            content: 'اختر فريقك يا بطل:', 
            components: [row] 
        });
    },
};