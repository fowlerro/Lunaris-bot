
const { MessageEmbed } = require("discord.js");

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
            const embed = new MessageEmbed()
				.addField('Cos', '[Link :)](https://google.com)');
				
			message.channel.send(embed);

        } catch(err) {
            console.log(err)
        }
    }
}