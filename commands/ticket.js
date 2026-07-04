const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
module.exports = {
    name: 'set-ticket',
    execute(message) {
        const embed = new EmbedBuilder().setTitle('🎫 نظام الدعم الفني').setColor('#00FFFF')
            .setDescription('● **Welcome!**\n● **Need help?** Open a ticket.\n● **Click below.**');
        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('create_ticket').setLabel('فتح تذكرة 🎫').setStyle(ButtonStyle.Primary));
        message.channel.send({ embeds: [embed], components: [row] });
    }
};