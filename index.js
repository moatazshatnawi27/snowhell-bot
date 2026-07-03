const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent
    ] 
});

client.commands = new Collection();

// تحميل الأوامر من مجلد commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(__dirname, 'commands', file);
    const command = require(filePath);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log(`البوت شغال بأمان يا معتز باسم: ${client.user.tag}`);
    client.user.setPresence({ status: 'online' });
});

client.on('messageCreate', async message => {
    // البادئة الجديدة SH مع جعلها غير حساسة لحالة الأحرف
    if (!message.content.toUpperCase().startsWith('SH') || message.author.bot) return;

    // بما أن SH حرفان، قمنا بتغيير الـ slice إلى 2
    const args = message.content.slice(2).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    try {
        client.commands.get(commandName).execute(message, args);
    } catch (error) {
        console.error(error);
        message.reply('حدث خطأ أثناء تنفيذ هذا الأمر!');
    }
});

// التوكن يُسحب من إعدادات Railway (الـ Variables)
client.login(process.env.TOKEN);
