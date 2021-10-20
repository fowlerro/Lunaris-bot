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
        pl: 'xp <user> <akcja> <ilość> [jednostka] [opcje]',
        en: 'xp <user> <action> <amount> [unit] [options]',
    },
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
        const unitArgs = { xp: ['xp'], lvl: ['lvl', 'level', 'levels'] }
        const scopeArgs = { global: ['g', 'global'], guild: ['server', 'guild', 'local'] }
        const [ user, action, ...options] = args
        // action: set, get, add, remove
        // unit: xp, lvl/level/levels

        const member = !isNaN(user) ? await message.guild.members.fetch(user) : message.mentions.members.first();
        if(!member) return

        const amount = ['set', 'add', 'remove'].includes(options[0]) ? options[0] : null
        if(['set', 'add', 'remove'].includes(options[0])) options.shift()

        const unit = unitArgs.xp.includes(options[0]) ? 'xp' : unitArgs.lvl.includes(options[0]) ? 'lvl' : 'xp'
        if(unitArgs.xp.includes(options[0]) ||  unitArgs.lvl.includes(options[0])) options.shift()

        const scope = scopeArgs.global.some(item => options.includes(item)) ? 'global'
            : scopeArgs.guild.some(item => options.includes(item)) ? 'guild' : 'global'
        
        const guildId = Number(options.filter(option => !isNaN(option) && option.length === 18)[0]) || message.guild.id
        if(!guildId || isNaN(guildId)) return

        const guild = await client.guilds.fetch(guildId).catch(() => {})
        if(scope === 'guild' && !guild) return

        const msg = await handleAction(member.id, action, amount, unit, scope, guild)
        console.log(msg)
        // TODO: Fix
        return message.channel.send(msg);
    }
}

function handleAction(userId, action, amount, unit, scope, guild) {
    if(action === 'add') return add(userId, amount, unit, scope, guild)
    if(action === 'remove') return remove(userId, amount, unit, scope, guild)
    if(action === 'set') return set(userId, amount, unit, scope, guild)
    return get(userId, scope, guild)
}

async function get(userId, scope, guild) {
    const profile = await Profiles.get(global.client, userId, scope === 'global' ? null : guild?.id)
    console.log(profile)
    const text = profile.statistics.text
    const voice = profile.statistics.voice
    const msg = `Text: ${text.level} lvl | ${text.xp} xp | ${text.totalXp} total XP | ${text.dailyXp} daily XP
Voice: ${voice.level} lvl | ${voice.xp} xp | ${voice.totalXp} total XP | ${voice.dailyXp} daily XP | ${voice.timeSpent} min`

    const embed = new MessageEmbed()
        .setColor(palette.info)
        .addField('Text', `${text.level} lvl\n${text.xp} xp\n${text.totalXp} total XP\n${text.dailyXp} daily XP`, true)
        .addField('Voice', `${voice.level} lvl\n${voice.xp} xp\n${voice.totalXp} total XP\n${voice.dailyXp} daily XP\n${voice.timeSpent} min`, true)

    console.log(embed)
    return { embed: [embed] }
}

function add(userId, amount, unit, scope, guild) {
    console.log('add', { amount, unit, scope, guild })
}

function remove(userId, amount, unit, scope, guild) {
    console.log('remove', { amount, unit, scope, guild })
}

function set(userId, amount, unit, scope, guild) {
    console.log('set', { amount, unit, scope, guild })
}