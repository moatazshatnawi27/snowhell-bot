const fs = require('fs');
module.exports = {
    name: 'addpoints',
    execute(message, args) {
        if (!message.member.permissions.has('Administrator')) return;
        const points = parseInt(args[0]);
        const team = args[1]?.toLowerCase() === 'snow' ? 'Snow' : 'Hell';
        if (isNaN(points) || !['Snow', 'Hell'].includes(team)) return message.reply('طريقة الاستخدام: `.addpoints 10 Snow`');

        const data = JSON.parse(fs.readFileSync('./points.json', 'utf8'));
        data[team] += points;
        fs.writeFileSync('./points.json', JSON.stringify(data));
        message.reply(`✅ تم إضافة **${points}** نقطة لفريق **${team}**!`);
    }
};