const { messageChart } = require("../../modules/guildStatistics");

module.exports = {
    name: 'chart',
    aliases: [],
    ownerOnly: true,
    minArgs: null,
    maxArgs: null,
    autoRemove: true,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Komenda testowa",
        en: "Testing command",
    },
    category: 'help',

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
    cooldownReminder: false,
    async run(client, message, args) {
        try {
            messageChart(client, message.guild);
        } catch(err) {
            console.log(err);
        }
    }
}