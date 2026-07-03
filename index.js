const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

// إعداد البوت مع الصلاحيات الضرورية
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.commands = new Collection();

// تحميل الأوامر من مجلد commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`البوت شغال يا وحش باسم: ${client.user.tag}`);
});

// تشغيل الأوامر
client.on('messageCreate', async message => {
    if (!message.content.startsWith('!') || message.author.bot) return; // غير '!' بالبادئة (prefix) التي تستخدمها

    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    try {
        client.commands.get(commandName).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('في خطأ في تنفيذ الأمر!');
    }
});

// ضع التوكن الخاص بك هنا بدلاً من هذه الجملة
client.login("MTUyMjI0MDQ1MDU1ODQyNzMyOA.G11o54.U5fgc05dKL2AZ2YtXDrZrO3KvJ2srjYTxhl0Dk");
