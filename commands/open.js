module.exports = {
    name: 'ف',
    aliases: ['فتح'],
    async execute(message, args) {
        if (!message.member.permissions.has('ManageChannels')) {
            return message.reply('❌ لا تملك صلاحية إدارة الرومات.');
        }

        try {
            await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: null
            });
            message.reply('🔓 تم فتح الشات بنجاح، يمكن للجميع الكتابة الآن.');
        } catch (error) {
            console.error(error);
            message.reply('حدث خطأ أثناء فتح الشات.');
        }
    }
};