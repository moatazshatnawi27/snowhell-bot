module.exports = {
    name: 'بان', 
    aliases: ['تف ابدي'], 
    async execute(message, args) {
        if (!message.member.permissions.has('BanMembers')) {
            return message.reply('❌ لا تملك صلاحية حظر الأعضاء.');
        }

        const target = message.mentions.members.first();
        if (!target) return message.reply('⚠️ يرجى منشنة العضو المراد حظره نهائياً.');
        if (!target.bannable) return message.reply('❌ لا يمكنني حظر هذا العضو.');

        // فحص ما إذا تم كتابة الاختصار المركب "تف ابدي" لتخطي الكلمات بشكل صحيح في السبب
        let reason;
        if (message.content.includes('تف ابدي')) {
            reason = args.slice(2).join(' ') || 'لا يوجد سبب محدد';
        } else {
            reason = args.slice(1).join(' ') || 'لا يوجد سبب محدد';
        }

        await target.ban({ reason: reason })
            .then(() => message.reply(`🔨 تم حظر العضو **${target.user.tag}** نهائياً من السيرفر. السبب: ${reason}`))
            .catch(err => {
                console.error(err);
                message.reply('حدث خطأ أثناء محاولة الحظر.');
            });
    }
};