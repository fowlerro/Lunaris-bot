module.exports = {
    name: 'test',
    aliases: ['testCmd', 'testCommand'],
    ownerOnly: true,
    minArgs: 0,
    maxArgs: 0,
    autoRemove: true,
    autoRemoveResponse: true,
    globalStatus: true,
    status: true,

    description: {
        pl: "Komenda testowa",
        en: "Testing command",
    },
    category: 'testing',

    permissions: [],
    requiredChannels: [],
    blockedChannels: [],
    requiredRoles: [],
    blockedRoles: [],

    cooldownStatus: true,
    cooldown: '1h',
    cooldownPermissions: [],
    cooldownChannels: [],
    cooldownRoles: [],
    cooldownReminder: true,
    async run(client, message, args) {
        return message.channel.send('Test command works');
    }
}