
const { MessageEmbed } = require("discord.js");
const { checkEmbedLimits } = require("../../utils/utils");

module.exports = {
    name: 'test',
    aliases: [],
    ownerOnly: true,
    minArgs: null,
    maxArgs: null,
    autoRemove: true,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Testowa komenda",
        en: "Testing command",
    },
    category: 'test',

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
        let obj = {
            statistics: {
                text: {
                  level: 5,
                  xp: 1160,
                  totalXp: 3610,
                  dailyXp: 3610
                },
                voice: {
                  level: 1,
                  xp: 0,
                  totalXp: 0,
                  dailyXp: 0,
                  timeSpent: 0
                }
            },
            cardAppearance: {
                background: 0,
                accent: "#102693"
            },
            coins: 248,
        }

        console.log(obj);

        let chuj = {
            cardAppearance: {
                background: 1
            },
            statistics: {
                voice: {
                    level: 1,
                    timeSpent: 69,
                }
            },
        }

        let newObj = {...obj, ...chuj}

        console.log(newObj)

        return message.channel.send('test');
    }
}