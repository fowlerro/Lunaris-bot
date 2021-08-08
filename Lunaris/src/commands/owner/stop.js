const { toggleBot } = require("../../utils/utils");

module.exports = {
    name: 'stop',
    aliases: [],
    ownerOnly: true,
    minArgs: 0,
    maxArgs: 1,
    autoRemove: true,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Wyłącza bota",
        en: "Disables bot",
    },
    category: 'owner',

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
        toggleBot(client, false);
    }
}