const CommandConfig = require("../../database/schemas/CommandConfig");

module.exports = {
    name: 'savecmd',
    aliases: ['sc'],
    ownerOnly: true,
    minArgs: null,
    maxArgs: null,
    autoRemove: true,
    autoRemoveResponse: true,
    globalStatus: false,
    status: true,

    description: {
        pl: "Komenda testowa, to chyba do wyjebania xD",
        en: "Testing command, to chyba do wyjebania xD",
    },
    category: 'settings',
    errorMessage: 'Wystąpił problem z wykonaniem komendy...',

    permissions: ['MANAGE_GUILD'],
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
            for(const [key, command] of client.commands) {
                if(command.ownerOnly) continue;
                let cmdConfig = await CommandConfig.find({guildID: message.guild.id, name: command.name});
                if(!cmdConfig.length) {
                    await CommandConfig.create({
                        guildID: message.guild.id,
                        name: command.name,
                        aliases: command.aliases,
                        minArgs: command.minArgs,
                        maxArgs: command.maxArgs,
                        autoRemove: command.autoRemove,
                        autoRemoveResponse: command.autoRemoveResponse,
                        status: command.status,
                        requiredChannels: command.requiredChannels,
                        blockedChannels: command.blockedChannels,
                        requiredRoles: command.requiredRoles,
                        blockedRoles: command.blockedRoles,
                        cooldownStatus: command.cooldownStatus,
                        cooldown: command.cooldown,
                        cooldownPermissions: command.cooldownPermissions,
                        cooldownChannels: command.cooldownChannels,
                        cooldownRoles: command.cooldownRoles,
                        cooldownReminder: command.cooldownReminder,
                    });
                    console.log(command.name);
                }
            }
        } catch(err) {
            console.log(err)
        }
    }
}









