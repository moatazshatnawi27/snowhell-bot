module.exports = {
    name: 'ق',
    aliases: ['قفل'],
    async execute(message, args) {
        if (!message.member.permissions.has('ManageChannels')) {
            return message.reply('❌ لا تملك صلاحية إدارة الرومات.');
        }

        try {
            await message.channel.permissionOverwrites.edit(message.guild.roles.everyone, {
                SendMessages: false
            });
            message.reply('🔒 تم قفل الشات بنجاح، لا يمكن للأعضاء الكتابة الآن.');
        } catch (error) {
            console.error(error);
            message.reply('حدث خطأ أثناء قفل الشات.');
        }
    }
};