module.exports = {
    name: 'gstart',
    execute(message, args) {
        const duration = args[0];
        const prize = args.slice(1).join(" ");
        if (!duration || !prize) return message.reply('استخدم: SHgstart <الدقائق> <الجائزة>');
        
        message.channel.send(`🎉 **قيف أوي جديد!** 🎉\nالجائزة: ${prize}\nينتهي بعد ${duration} دقيقة!`);
        // هنا يتم إضافة كود Timer لاحقاً
    }
};