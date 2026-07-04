const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'انبان', // الاسم الذي اعتمدناه
    execute(message, args) {
        // التحقق من صلاحية البان
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('ما عندك صلاحيات يا بطل!');
        }

        const userId = args[0]; // بنحتاج الـ ID الخاص بالعضو
        if (!userId) {
            return message.reply('الاستخدام الصحيح: `SHانبان <ID_العضو>`');
        }

        // تنفيذ فك الحظر
        message.guild.members.unban(userId)
            .then(() => {
                const embed = new EmbedBuilder()
                    .setTitle('🔓 تم فك الحظر')
                    .setColor('#00FF00')
                    .setDescription(`● **العضو (ID):** ${userId}\n● **بواسطة:** ${message.author.tag}`);
                
                message.channel.send({ embeds: [embed] });
            })
            .catch(err => {
                console.error(err);
                message.reply('خطأ! تأكد أن الـ ID صحيح وأن العضو محظور فعلاً.');
            });
    }
};