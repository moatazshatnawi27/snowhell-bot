const { Client, GatewayIntentBits, Collection, ChannelType, PermissionsBitField } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration
    ] 
});

client.commands = new Collection();

// 1. تحميل الأوامر
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
}

// 2. قاموس الـ IDs للرومات (اللوق)
const logChannels = {
    msgDelete: '1521902590600675468',
    memberAdd: '1521902604202807316',
    memberRemove: '1521902608791634000',
    channelCreate: '1521902616332992754',
    channelDelete: '1521902620590215198',
    channelUpdate: '1521902626453721208',
    roleCreate: '1521902635299373118',
    roleDelete: '1521902649048301628',
    ticket: '1521902656941985843'
};

const sendLog = (guild, channelId, message) => {
    const channel = guild.channels.cache.get(channelId);
    if (channel) channel.send(message).catch(console.error);
};

client.once('ready', () => {
    console.log(`البوت جاهز يا معتز، شغال باسم: ${client.user.tag}`);
});

// 3. نظام الأوامر
client.on('messageCreate', async message => {
    if (message.author.bot || !message.content.toUpperCase().startsWith('SH')) return;
    const args = message.content.slice(2).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    if (!client.commands.has(commandName)) return;
    try { client.commands.get(commandName).execute(message, args); } catch (e) { console.error(e); }
});

// 4. نظام اللوق الشامل
client.on('messageDelete', m => sendLog(m.guild, logChannels.msgDelete, `🗑️ رسالة محذوفة من: ${m.author?.tag}\nالمحتوى: ${m.content}`));
client.on('guildMemberAdd', m => sendLog(m.guild, logChannels.memberAdd, `📥 عضو جديد: ${m.user.tag}`));
client.on('guildMemberRemove', m => sendLog(m.guild, logChannels.memberRemove, `📤 عضو غادر: ${m.user.tag}`));
client.on('channelCreate', c => sendLog(c.guild, logChannels.channelCreate, `➕ روم جديدة: ${c.name}`));
client.on('channelDelete', c => sendLog(c.guild, logChannels.channelDelete, `➖ روم محذوفة: ${c.name}`));
client.on('roleCreate', r => sendLog(r.guild, logChannels.roleCreate, `🛡️ رتبة جديدة: ${r.name}`));
client.on('roleDelete', r => sendLog(r.guild, logChannels.roleDelete, `🗑️ رتبة محذوفة: ${r.name}`));

// 5. التفاعلات (أزرار الرتب والتيكيت)
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'create_ticket') {
        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
            ]
        });
        interaction.reply({ content: `تم فتح تيكيت خاص بك: ${channel}`, ephemeral: true });
    }

    if (interaction.customId === 'snow' || interaction.customId === 'hell') {
        const roleId = interaction.customId === 'snow' ? '1521898122547167353' : '1521904326920900740';
        await interaction.member.roles.add(roleId);
        interaction.reply({ content: 'تم إعطاؤك الرتبة! 🚀', ephemeral: true });
    }
});

client.login(process.env.TOKEN);