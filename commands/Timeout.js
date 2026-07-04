const { EmbedBuilder, PermissionsBitField } = require('discord.js');
module.exports = {
    name: 'تايم',
    execute(message, args) {
        const member = message.mentions.members.first();
        const duration = parseInt(args[1]);
        member.timeout(duration * 60 * 1000, args.slice(2).join(" "));
        message.reply('تم عمل التايم!');
    }
};