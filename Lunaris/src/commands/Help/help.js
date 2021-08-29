const { MessageEmbed, MessageActionRow, MessageSelectMenu, Formatters } = require("discord.js");
const { palette, botOwners, assignNestedObjects, capitalize } = require("../../utils/utils");
const { translate } = require("../../utils/languages/languages");
const Guilds = require("../../modules/Guilds");

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
        const guildConfig = await Guilds.config.get(client, message.guild.id);
        const prefix = guildConfig.get('prefix');
        const language = guildConfig.get('language');

        if(args[0]) {
            let cmd = client.commands.get(args[0])
            if(cmd) {
                if((!botOwners.includes(message.author.id) && cmd.ownerOnly)) return;
                
                const embed = new MessageEmbed()
                    .setColor(palette.info)
                    .setTitle(translate(language, 'cmd.cmdHelpTitle', `'${cmd.name}'`))
                    .setDescription(cmd.description[language]); 
                cmd.aliases.length && embed.addField(translate(language, 'general.aliases'), cmd.aliases.toString());
                cmd.syntax && embed.addField(translate(language, 'general.syntax'), `${prefix}${cmd.syntax[language]}
                    ${cmd.syntaxHelp ? cmd.syntaxHelp[language] : ""}`);
                cmd.syntaxExample && embed.addField(translate(language, 'general.example'), `${prefix}${cmd.syntaxExample}`);
                (!cmd.status || !cmd.globalStatus) && embed.setFooter(translate(language, 'cmd.globalStatus'));
                embed.setTimestamp();

                return message.reply({embeds: [embed], allowedMentions: { repliedUser: false } });
            }
        }
        
        const categories = {}
        client.commands.forEach(command => {
            if(!botOwners.includes(message.author.id) && command.ownerOnly) return;
            assignNestedObjects(categories, [...command.cat, 'commands'], command);
        });

        const defaultPage = Object.keys(categories).find(category => category.toLowerCase().startsWith(args[0]?.toLowerCase()) ) || 'Help';
        const embeds = [];
        
        Object.keys(categories).forEach(category => {
            const fields = [];
            const subcategories = Object.keys(categories[category]);
            const commands = subcategories.map(subcat => {
                if(subcat !== 'commands') {
                    fields.push({
                        name: capitalize(subcat),
                        value: categories[category][subcat]['commands'].map(command => `${Formatters.inlineCode(command.name)} ${command.description[language]}`).join('\n')
                    });
                } else
                    return categories[category][subcat].map(command => `${Formatters.inlineCode(command.name)} ${command.description[language]}`).join('\n')
            }).join('\n')

            const embed = new MessageEmbed()
                .setColor(palette.info)
                .setTitle(capitalize(category))
                .setFooter(translate(language, 'cmd.helpFooter', prefix))
                .setDescription(commands)
                .setTimestamp();
            fields.length && embed.addFields(fields);

            embeds.push(embed);
        })

        const menuOptions = Object.keys(categories).map((category, index) => ({
            label: category,
            value: category,
            default : defaultPage === category ? true : false,
        }));

        const menuComponent = new MessageSelectMenu()
            .addOptions(menuOptions)
            .setPlaceholder('Select category')
            .setCustomId('helpMenu');

        const component = new MessageActionRow()
            .addComponents(menuComponent)

        const filter = (interaction) => interaction.isSelectMenu() && interaction.user.id === message.author.id;

        const msg = await message.reply({ embeds: [embeds[Object.keys(categories).indexOf(defaultPage)]], components: [component], allowedMentions: { repliedUser: false } });

        const menuCollector = msg.createMessageComponentCollector({ filter, time: 60000 })

        menuCollector.on('collect', async (interaction) => {
            const selected = interaction.values[0]
            const embed = embeds[Object.keys(categories).indexOf(selected)]

            menuComponent.options.forEach(option => {
                option.default = false
            })
            menuComponent.options.find(option => option.value === selected).default = true;
            component.components = [menuComponent]
            
            await interaction.update({ embeds: [embed], components: [component] });
        });
    }
}