const { getGuildProfile, generateProfileCard, getGlobalProfile } = require("../../../modules/Profiles/profile");

module.exports = {
    name: 'profile',
    aliases: ['rank'],
    ownerOnly: false,
    minArgs: 0,
    maxArgs: 1,
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
        const member = args[0] ? message.mentions.members.first() || await message.guild.members.fetch(args[0]) : (await message.guild.members.fetch(message.author.id));
        const guildConfig = client.guildConfigs.get(message.guild.id);

        const profile = await getGuildProfile(message.guild.id, member.id);
        if(!profile) return;
        const globalProfile = await getGlobalProfile(member.id);
        if(!globalProfile) return;

        const profileCardBuffer = await generateProfileCard(member, profile, globalProfile, member.user.avatarURL({ format: 'png' }));

        return message.channel.send({ files: [profileCardBuffer] });
    }
}