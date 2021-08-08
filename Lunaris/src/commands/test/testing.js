
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
        let fields = [];
        for (let i = 0; i < 250; i++) {
            fields[i] = {
                name: `chuj${i+1}`,
                value: `chuj${i+1}`,
                inline: true
            }
        }
        const embed = new MessageEmbed()
            .addFields(fields)

        
        checkEmbedLimits(client, embed, message.channel);

        // console.log(embed.footer.text.length);

        return message.channel.send('test');
    }
}