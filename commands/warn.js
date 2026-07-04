// ذاكرة مؤقتة لتخزين تحذيرات الأعضاء (تتحمل إعادة تشغيل البوت إذا ربطتها بقاعدة بيانات لاحقاً)
const warningsMemory = new Map();

module.exports = {
    name: 'w',
    aliases: ['تحذير'],
    async execute(message, args) {
        if (!message.member.permissions.has('ModerateMembers')) {
            return message.reply('❌ لا تملك صلاحية تحذير الأعضاء.');
        }

        const target = message.mentions.members.first();
        if (!target) return message.reply('⚠️ يرجى منشنة العضو المراد تحذيره.');
        if (target.user.bot) return message.reply('لا يمكنك تحذير البوتات.');

        const reason = args.slice(1).join(' ') || 'مخالفة القوانين العامة';
        const guildId = message.guild.id;
        const userId = target.id;
        const key = `${guildId}-${userId}`;

        // زيادة عدد التحذيرات للعضو
        let currentWarns = warningsMemory.get(key) || 0;
        currentWarns++;
        warningsMemory.set(key, currentWarns);

        if (currentWarns >= 3) {
            // تصفير العداد قبل الطرد
            warningsMemory.set(key, 0);

            if (!target.kickable) {
                return message.channel.send(`⚠️ ${target} وصل إلى 3 تحذيرات، ولكن لا يمكنني طرده بسبب رتبته العالية!`);
            }

            // تنفيذ الطرد التلقائي
            await target.kick(`الوصول للحد الأقصى من التحذيرات (3/3) - السبب الأخير: ${reason}`)
                .then(() => {
                    message.channel.send(`✈️ **طرد تلقائي:** تم طرد العضو ${target.user.tag} بسبب وصوله إلى **3 تحذيرات**!`);
                })
                .catch(err => {
                    console.error(err);
                    message.reply('حدث خطأ أثناء محاولة الطرد التلقائي.');
                });
        } else {
            // إرسال رسالة التحذير العادية
            message.channel.send(`⚠️ تم إعطاء تحذير رسمي لـ ${target} (**${currentWarns}/3**).\n**السبب:** ${reason}`);
            
            // إرسال في الخاص للعضو
            target.send(`🔴 لقد تلقيت تحذيراً في سيرفر **${message.guild.name}** (${currentWarns}/3). السبب: ${reason}`).catch(() => {});
        }
    }
};