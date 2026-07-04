const { Client, GatewayIntentBits, Events, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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

// --- قائمة الـ IDs للوقات ---
const LOGS = {
    BAN: '1521902582220460233', UNBAN: '1521902586716749965',
    DELETE_MSG: '1521902590600675468', TIMEOUT: '1521902594480672818',
    KICK: '1521902600050442370', JOIN: '1521902604202807316',
    LEAVE: '1521902608791634000', NAME_CHANGE: '1521902612428099644',
    CHANNEL_CREATE: '1521902616332992754', CHANNEL_DELETE: '1521902620590215198',
    CHANNEL_UPDATE: '1521902626453721208', CHANNEL_PERMS: '1521902631344275726',
    ROLE_CREATE: '1521902635299373118', ROLE_ADD: '1521902638843564042',
    ROLE_REMOVE: '1521902642161516585', ROLE_DELETE: '1521902649048301628',
    ROLE_UPDATE: '1521902652743745720', TICKET: '1521902656941985843'
};

// --- تحميل الأوامر ---
client.commands = new Map();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    client.commands.set(command.name, command);
}

// --- معالجة الأوامر ---
client.on(Events.MessageCreate, message => {
    if (message.author.bot || !message.content.startsWith('.')) return;
    const args = message.content.slice(1).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName);
    if (command) command.execute(message, args);
});

// --- نظام التيكت ---
client.on(Events.InteractionCreate, async interaction => {
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

        const embed = new EmbedBuilder()
            .setTitle('🎫 تذكرة دعم فني')
            .setDescription(`مرحباً **${interaction.user.username}**، اشرح مشكلتك وسيقوم الإداريون بالرد عليك.`)
            .setColor('#00FFFF');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('close_ticket').setLabel('إغلاق التيكت').setStyle(ButtonStyle.Danger)
        );

        channel.send({ content: `<@${interaction.user.id}>`, embeds: [embed], components: [row] });
        interaction.reply({ content: `✅ تم فتح تيكت: ${channel}`, ephemeral: true });
        interaction.guild.channels.cache.get(LOGS.TICKET)?.send(`🎫 تيكت جديد فُتح بواسطة: ${interaction.user.tag} في ${channel}`);
    }

    if (interaction.customId === 'close_ticket') {
        interaction.reply('سيتم إغلاق التيكت وحذفه خلال 5 ثوانٍ...');
        setTimeout(() => interaction.channel.delete(), 5000);
    }
});

// --- اللوقات ---
client.on(Events.GuildMemberAdd, m => m.guild.channels.cache.get(LOGS.JOIN)?.send(`👤 انضم: ${m.user.tag}`));
client.on(Events.GuildMemberRemove, m => m.guild.channels.cache.get(LOGS.LEAVE)?.send(`👋 غادر: ${m.user.tag}`));
client.on(Events.MessageDelete, m => m.guild.channels.cache.get(LOGS.DELETE_MSG)?.send(`🗑️ حُذفت رسالة من ${m.author?.tag || 'شخص مجهول'}`));

client.on(Events.GuildAuditLogEntryCreate, entry => {
    const { action, target } = entry;
    if (action === 22) client.channels.cache.get(LOGS.BAN)?.send(`🔨 تم حظر: ${target.tag}`);
    if (action === 20) client.channels.cache.get(LOGS.KICK)?.send(`👢 تم طرد: ${target.tag}`);
    if (action === 24) client.channels.cache.get(LOGS.TIMEOUT)?.send(`⏳ تم إعطاء تايم آوت: ${target.tag}`);
});

// تشغيل البوت باستخدام متغير البيئة في Railway
client.login(process.env.TOKEN);