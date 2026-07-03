require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // تأكد أنك مفعلها في موقع المطورين!
        GatewayIntentBits.GuildMembers
    ]
});

const PREFIX = '!'; // تأكد أنك تكتب ! قبل الأمر في الديسكورد
client.commands = new Collection();

// قراءة ملفات الأوامر
const commandsPath = path.join(__dirname, 'commands');
if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath);

const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

console.log('--- جاري تحميل الأوامر ---');
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if (command.name) {
        client.commands.set(command.name, command);
        console.log(`✅ تم تحميل الأمر: ${command.name}`);
        
        if (command.aliases && Array.isArray(command.aliases)) {
            command.aliases.forEach(alias => {
                client.commands.set(alias, command);
                console.log(`   🔗 تم ربط اختصار: ${alias}`);
            });
        }
    }
}
console.log('------------------------');

client.once('ready', () => {
    console.log(`✅ البوت شغال الآن باسم: ${client.user.tag}`);
});

// حدث استقبال الرسائل المطور والمضمون للأوامر العربية
client.on('messageCreate', async message => {
    // تجاهل رسائل البوتات
    if (message.author.bot) return;

    // فحص إذا كانت الرسالة تبدأ بالبادئة
    if (!message.content.startsWith(PREFIX)) return;

    // تقطيع الرسالة بدقة وفصل البادئة عن الكلمة الأولى
    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift(); // أزلنا .toLowerCase() لضمان عدم اللعب بالكلمات العربية

    if (!commandName) return;

    // طباعة فحص في الشاشة السوداء لنرى ماذا يقرأ البوت
    console.log(`🔍 تم استقبال أمر: [${commandName}] مع البارامترات: [${args.join(', ')}]`);

    // البحث عن الأمر
    const command = client.commands.get(commandName);

    if (!command) {
        console.log(`❌ لم يتم العثور على أمر باسم أو اختصار: ${commandName}`);
        return;
    }

    try {
        await command.execute(message, args);
        console.log(`🚀 تم تنفيذ الأمر [${commandName}] بنجاح.`);
    } catch (error) {
        console.error('💥 حدث خطأ أثناء تنفيذ الأمر:', error);
        message.reply('❌ حدث خطأ داخلي أثناء تنفيذ هذا الأمر.');
    }
});

// ضع التوكن الخاص بك هنا
client.login(process.env.DISCORD_TOKEN);