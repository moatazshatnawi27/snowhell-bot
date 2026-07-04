module.exports = {
    name: 'انتايم',
    execute(message, args) {
        const member = message.mentions.members.first();
        member.timeout(null);
        message.reply('تم فك التايم!');
    }
};