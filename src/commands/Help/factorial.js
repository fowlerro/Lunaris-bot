
module.exports = {
    name: 'factorial',
    aliases: ['fact', 'silnia'],
    ownerOnly: false,
    minArgs: 1,
    maxArgs: 1,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Oblicza silnię",
        en: "Calculate factorial",
    },
    category: 'help',
    syntax: {
        pl: 'silnia <liczba>',
        en: 'factorial <number>',
    },
    syntaxExample: 'factorial 10',

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
    cooldownReminder: false,
    async run(client, message, args) {
        const number = Number(args[0]) || null;
        if(!number) return

        const results = factorial(number)

        message.reply({ content: `${number}! = ${results}`, allowedMentions: { repliedUser: false } })
    }
}

var f = [];
function factorial(n) {
    if (n == 0 || n == 1)
      return 1;
    if (f[n] > 0)
      return f[n];
    return f[n] = factorial(n-1) * n;
}