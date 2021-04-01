
module.exports = {
    name: 'test',
    aliases: [],
    ownerOnly: true,
    minArgs: null,
    maxArgs: null,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Testowa komenda",
        en: "Testing command",
    },
    category: 'test',

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
            const map = new Map();
            map.set('chuj', {1: 'jeden', 2: 'dwa', 'trzy': 'chuj'});
            console.log(map)
            const chuj = map.get('chuj');
            console.log(chuj)
            const trzy = chuj.get('trzy');
            console.log(trzy)

        } catch(err) {
            console.log(err)
        }
    }
}