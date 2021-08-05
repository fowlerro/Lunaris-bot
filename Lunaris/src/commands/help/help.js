const { MessageEmbed } = require("discord.js");
const { botOwners } = require("../../bot");
const { palette } = require("../../utils/utils");
const { translate } = require("../../utils/languages/languages");

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
    syntax: {
        pl: 'help [<command>]',
        en: 'help [<command>]',
    },
    syntaxExample: 'help mute',

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
            const guildConfig = client.guildConfigs.get(message.guild.id);
            const prefix = guildConfig.get('prefix');
            const language = guildConfig.get('language');

            let categories = [];
            client.commands.forEach(cmd => {
                if(!botOwners.includes(message.author.id) && cmd.ownerOnly) return;
                if(!categories.includes(cmd.category)) categories.push(cmd.category)
            });

            if(args[0]) {
                let cmd = client.commands.get(args[0])
                if((!botOwners.includes(message.author.id) && cmd.ownerOnly) || !cmd) return;
                
                const embed = new MessageEmbed()
                    .setColor(palette.info)
                    .setTitle(translate(language, 'cmd.cmdHelpTitle', `'${cmd.name}'`))
                    .setDescription(cmd.description[language]);
                cmd.aliases.length > 0 && embed.addField(translate(language, 'general.aliases'), cmd.aliases);
                cmd.syntax && embed.addField(translate(language, 'general.syntax'), `${prefix}${cmd.syntax[language]}
                    ${cmd.syntaxHelp ? cmd.syntaxHelp[language] : ""}`);
                cmd.syntaxExample && embed.addField(translate(language, 'general.example'), `${prefix}${cmd.syntaxExample}`);
                (!cmd.status || !cmd.globalStatus) && embed.setFooter(translate(language, 'cmd.globalStatus'));
                embed.setTimestamp();
                return message.channel.send(embed);
            } 

            const embed = new MessageEmbed()
                .setColor(palette.info)
                .setTitle(translate(language, 'cmd.helpTitle'))
                .addFields(categories.map(category => (
                    {
                        name: category,
                        value: Array.from(client.commands).filter(cmd => cmd[1].category === category && cmd[0] === cmd[1].name && (!cmd[1].ownerOnly || botOwners.includes(message.author.id))).map(cmd => "`" + prefix + cmd[1].name + "` " + cmd[1].description[language])
                    }
                )))
                .setFooter(translate(language, 'cmd.helpFooter', prefix))
                .setTimestamp();

            return message.channel.send(embed);
        } catch(err) {
            console.log(err);
        }
    }
}