const { toggleBot } = require("../../utils/utils");

module.exports = {
    name: 'start',
    aliases: [],
    ownerOnly: true,
    minArgs: 0,
    maxArgs: 1,
    autoRemove: true,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Włącza bota",
        en: "Activates bot",
    },
    category: 'owner',

    permissions: [],
    requiredChannels: [],
    blockedChannels: [],
    requiredRoles: [],
    blockedRoles: [],

    cooldownStatus: false,
    cooldown: '30s',
    cooldownPermissions: [],
    cooldownChannels: [],
    cooldownRoles: [],
    cooldownReminder: true,
    async run(client, message, args) {
        try {
            toggleBot(client, true);
        } catch(err) {
            console.log(err);
        }
    }
}