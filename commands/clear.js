module.exports = {
    name: 'مسح',
    aliases: ['مسح'],
    async execute(message, args) {
        if (!message.member.permissions.has('ManageMessages')) {
            return message.reply('❌ لا تملك صلاحية مسح الرسائل.');
        }

        const amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) {
            return message.reply('⚠️ يرجى تحديد عدد رسائل بين 1 و 100 للمسح.');
        }

        await message.channel.bulkDelete(amount, true)
            .then(messages => {
                message.channel.send(`🧹 تم مسح ${messages.size} رسالة بنجاح.`).then(msg => {
                    setTimeout(() => msg.delete(), 3000);
                });
            })
            .catch(err => {
                console.error(err);
                message.reply('حدث خطأ أثناء محاولة مسح الرسائل.');
            });
    }
};