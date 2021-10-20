const { MessageEmbed } = require("discord.js");
const Profiles = require("../../../modules/Profiles");
const { palette } = require("../../../utils/utils");

module.exports = {
    name: 'xp',
    aliases: [],
    ownerOnly: true,
    minArgs: 2,
    maxArgs: null,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Modyfikuje XP użytkownika",
        en: "Modify user's XP",
    },
    category: 'profiles',
    syntax: {
        pl: 'xp <user> <akcja> <typ> <ilość> [jednostka] [opcje]',
        en: 'xp <user> <action> <type> <amount> [unit] [options]',
    },
    // syntaxHelp: {
    //     pl: `Akcja: get/add/remove/set\nJednostka: xp/lvl\n\nOpcje:\nglobal/server\n`
    // },
    permissions: [],
    allowedChannels: [],
    blockedChannels: [],
    allowedRoles: [],
    blockedRoles: [],

    cooldownStatus: false,
    cooldown: '30s',
    cooldownPermissions: [],
    cooldownChannels: [],
    cooldownRoles: [],
    cooldownReminder: true,
    async run(client, message, args) {
        const typeArgs = { text: ['text'], voice: ['voice', 'vc'] }
        const unitArgs = { xp: ['xp'], lvl: ['lvl', 'level', 'levels'] }
        const scopeArgs = { global: ['g', 'global'], guild: ['server', 'serwer', 'guild', 'local'] }
        const [ user, action, ...options] = args
        // action: set, get, add, remove
        // unit: xp, lvl/level/levels

        const member = !isNaN(user) ? await message.guild.members.fetch(user) : message.mentions.members.first();
        if(!member) return

        const type = typeArgs.text.includes(options[0]) ? 'text' : typeArgs.voice.includes(options[0]) ? 'voice' : null
        if(!type && action !== 'get') return
        if(type) options.shift()

        const amount = ['set', 'add', 'remove'].includes(action) ? options[0] : null
        if(['set', 'add', 'remove'].includes(action)) options.shift()

        const unit = unitArgs.xp.includes(options[0]) ? 'xp' : unitArgs.lvl.includes(options[0]) ? 'lvl' : 'xp'
        if(unitArgs.xp.includes(options[0]) ||  unitArgs.lvl.includes(options[0])) options.shift()

        const scope = scopeArgs.global.some(item => options.includes(item)) ? 'global'
            : scopeArgs.guild.some(item => options.includes(item)) ? 'guild' : 'global'
        
        const guildId = Number(options.filter(option => !isNaN(option) && option.length === 18)[0]) || message.guild.id
        if(!guildId || isNaN(guildId)) return

        const guild = await client.guilds.fetch(guildId).catch(() => {})
        if(scope === 'guild' && !guild) return

        const msg = await handleAction(member.id, type, action, amount, unit, scope, guild)
        return message.channel.send(msg);
    }
}

function handleAction(userId, type, action, amount, unit, scope, guild) {
    if(action === 'add') return add(userId, type, amount, unit, scope, guild)
    if(action === 'remove') return remove(userId, type, amount, unit, scope, guild)
    if(action === 'set') return set(userId, type, amount, unit, scope, guild)
    return get(userId, scope, guild)
}

async function get(userId, scope, guild) {
    const profile = await Profiles.get(global.client, userId, scope === 'global' ? null : guild?.id)
    const text = profile.statistics.text
    const voice = profile.statistics.voice

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .addField('Text', `${text.level} lvl\n${text.xp} xp\n${text.totalXp} total XP\n${text.dailyXp} daily XP`, true)
        .addField('Voice', `${voice.level} lvl\n${voice.xp} xp\n${voice.totalXp} total XP\n${voice.dailyXp} daily XP\n${voice.timeSpent} min`, true)

    return { embeds: [embed] }
}

async function add(userId, type, amount, unit, scope, guild) {
    console.log('add', { type, amount, unit, scope, guild })
}

async function remove(userId, type, amount, unit, scope, guild) {
    console.log('remove', { type, amount, unit, scope, guild })
}

async function set(userId, type, amount, unit, scope, guild) {
    console.log('set', { type, amount, unit, scope, guild })

    const profile = await Profiles.get(global.client, userId, scope === 'global' ? null : guild?.id)
    const stats = profile.statistics[type]
    
}
