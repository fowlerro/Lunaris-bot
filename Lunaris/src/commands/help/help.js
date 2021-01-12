const { MessageEmbed } = require("discord.js");
const { palette } = require("../../bot");
const GuildConfig = require("../../database/schemas/GuildConfig");
const { getLocale } = require("../../utils/languages/languages");

module.exports = {
    name: 'help',
    aliases: [],
    ownerOnly: false,
    minArgs: null,
    maxArgs: null,
    autoRemove: false,
    autoRemoveResponse: false,
    globalStatus: true,
    status: true,

    description: {
        pl: "Wyświetla pomoc dotyczącą komend",
        en: "Display commands help",
    },
    category: 'help',

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
    cooldownReminder: false,
    async run(client, message, args) {
        try {
            const guildConfig = await GuildConfig.findOne({guildID: message.guild.id});
            const prefix = guildConfig.get('prefix');
            const language = guildConfig.get('language');

            let categories = [];
            client.commands.forEach(cmd => {
                if(!categories.includes(cmd.category)) categories.push(cmd.category)
            });
            const embed = new MessageEmbed()
                .setColor(palette.info)
                .addFields(categories.map(category => {
                    let cmds = Array.from(client.commands).filter(cmd => cmd[1].category === category && cmd[0] === cmd[1].name).map(cmd => cmd[1].name);
                    return {
                        name: category,
                        value: Array.from(client.commands).filter(cmd => cmd[1].category === category && cmd[0] === cmd[1].name).map(cmd => "`" + prefix + cmd[1].name + "` " + cmd[1].description[language])
                    }
                }));

            return message.channel.send(embed);
        } catch(err) {
            console.log(err);
        }
    }
}