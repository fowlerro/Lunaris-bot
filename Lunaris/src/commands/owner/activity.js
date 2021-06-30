const { setActivity } = require("../../utils/utils");

module.exports = {
    name: 'activity',
    aliases: ['status'],
    ownerOnly: true,
    minArgs: null,
    maxArgs: null,
    autoRemove: true,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Ustawia aktywność bota",
        en: "Sets bot activity",
    },
    category: 'owner',
    syntax: {
        pl: `activity <type> [<content>]\n
            types: PLAYING/LISTENING/WATCHING/COMPETING`,
        en: `activity <type> [<content>]\n
            types: PLAYING/LISTENING/WATCHING/COMPETING`,
    },
    syntaxExample: 'activity playing Minecraft',


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
            const [mode, ...activity] = args;
            setActivity(client, mode, activity.join(" "));
        } catch(err) {
            console.log(err);
        }
    }
}