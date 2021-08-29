const AutoRole = require("../../database/schemas/AutoRole");

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
        pl: "Ustawia auto role",
        en: "Sets auto roles",
    },
    category: 'settings',
    syntax: {
        pl: 'setar <roleID:time>',
        en: 'setar <roleID:time>',
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
        const roles = [];
        args.forEach(element => {
            let role = element.split(':');
            role = {roleId: role[0], time: role[1]};
            roles.push(role);
        });

        const autoRole = await AutoRole.findOne({guildId: message.guild.id});
        if(autoRole) {
            await autoRole.updateOne({
                roles
            });
        } else {
            await AutoRole.create({
                guildId: message.guild.id,
                roles,
            })
        }
    }
}