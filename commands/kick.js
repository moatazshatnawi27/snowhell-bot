module.exports = {
    name: 'تف',
    aliases: [],
    async execute(message, args) {
        if (!message.member.permissions.has('KickMembers')) {
            return message.reply('❌ لا تملك صلاحية طرد الأعضاء.');
        }

        const target = message.mentions.members.first();
        if (!target) return message.reply('⚠️ يرجى منشنة العضو المراد طرده.');

        if (!target.kickable) return message.reply('❌ لا يمكنني طرد هذا العضو.');

        const reason = args.slice(1).join(' ') || 'لا يوجد سبب محدد';

        await target.kick(reason)
            .then(() => message.reply(`✈️ تم طرد العضو **${target.user.tag}** بنجاح. السبب: ${reason}`))
            .catch(err => {
                console.error(err);
                message.reply('حدث خطأ أثناء محاولة الطرد.');
            });
    }
};