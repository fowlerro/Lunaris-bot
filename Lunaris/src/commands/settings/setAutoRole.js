const AutoRole = require("../../database/schemas/AutoRole");
const ms = require('ms');

module.exports = {
    name: 'setar',
    aliases: ['ar'],
    ownerOnly: true,
    minArgs: null,
    maxArgs: null,
    autoRemove: false,
    autoRemoveResponse: true,
    globalStatus: true,
    status: true,

    description: {
        pl: "Zmiana prefixu bota",
        en: "Change bot prefix",
    },
    category: 'settings',

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
            const roles = [];
            args.forEach(element => {
                let role = element.split(':');
                role = {roleID: role[0], time: role[1]};
                roles.push(role);
            });

            const autoRole = await AutoRole.findOne({guildID: message.guild.id});
            if(autoRole) {
                await autoRole.updateOne({
                    roles
                });
            } else {
                await AutoRole.create({
                    guildID: message.guild.id,
                    roles,
                })
            }
        } catch(err) {console.log(err)};
    }
}