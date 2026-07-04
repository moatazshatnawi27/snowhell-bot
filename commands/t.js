module.exports = {
    name: 'ت',
    aliases: ['تنبيه'],
    async execute(message, args) {
        if (!message.member.permissions.has('ModerateMembers')) {
            return message.reply('❌ لا تملك صلاحية إدارة الأعضاء.');
        }

        const target = message.mentions.members.first();
        if (!target) return message.reply('⚠️ يرجى منشنة العضو المراد تنبيهه شفوياً.');

        const reason = args.slice(1).join(' ') || 'مخالفة قوانين الدردشة';

        message.channel.send(`🗣️ **تنبيه شفوي:**\nيا ${target}، يرجى الالتزام بالقوانين وعدم التكرار.\n**السبب:** ${reason}`);
    }
};