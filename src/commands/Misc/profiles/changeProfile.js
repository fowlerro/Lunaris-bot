const { DataResolver } = require("discord.js");
const { setProfile } = require("../../../modules/Profiles/profile");

module.exports = {
    name: 'changeProfile',
    aliases: [],
    ownerOnly: true,
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

        const background = message.attachments.first();
        const buffer = await DataResolver.resolveFileAsBuffer(background.attachment);

        const profile = await setProfile(message.author.id, args[0], buffer);
        if(!profile) return;

        return message.channel.send({ content: 'ok' });
    }
}