const Profiles = require("../../../modules/Profiles");
const { getGuildProfile, generateProfileCard, getGlobalProfile } = require("../../../modules/Profiles/profile");
const { resetDailyXp } = require("../../../modules/xpSystem/utils");

module.exports = {
    name: 'profile',
    aliases: ['rank'],
    ownerOnly: false,
    minArgs: 0,
    maxArgs: 2,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Wyświetla profil użytkownika",
        en: "Displays user's profile",
    },
    category: 'profiles',
    syntax: {
        pl: 'profile [<user>]',
        en: 'profile [<user>]',
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
        const member = !isNaN(args[0]) ? await message.guild.members.fetch(args[0]) : message.mentions.members.first() || (await message.guild.members.fetch(message.author.id));
        const isGlobal = args.includes('global');

        const profile = await Profiles.get(client, member.id, message.guild.id);
        if(!profile) return;
        const globalProfile = await Profiles.get(client, member.id);
        if(!globalProfile) return;

        const profileCardBuffer = await Profiles.generateCard(member, profile, globalProfile, member.user.displayAvatarURL({ format: 'png' }), isGlobal);
        return message.channel.send({ files: [profileCardBuffer] });
    }
}