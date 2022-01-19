import { AutocompleteInteraction, CommandInteraction, EmbedFieldData, Formatters, MessageActionRow, MessageComponentInteraction, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";
import Guilds from "../../modules/Guilds";
import { translate } from "../../utils/languages/languages";
import { assignNestedObjects, capitalize, getCommandCategories, palette } from "../../utils/utils";
import { ProfileModel } from "../../database/schemas/Profile";

export default class HelpCommand extends BaseCommand {
    
    constructor() {
        super(
            'help',
            'CHAT_INPUT',
            {
                en: "Shows information about Lunaris and commands",
                pl: "Wyświetla informacje o Lunaris oraz jego komendach"
            },
            [
                {
                    name: 'category',
                    description: 'Category of the help which will be shown',
                    type: 'STRING',
                    choices: getCommandCategories().map(category => ({ name: category, value: category }))
                },
                {
                    name: 'command',
                    description: 'Specific command for more detailed information',
                    type: 'STRING',
                    autocomplete: true
                }
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guildId) return
        const { language } = await Guilds.config.get(interaction.guildId)

        const command = interaction.options.getString('command')

        if(command) {
            let cmd = client.commands.get(command)
            if(!cmd || cmd.category[0] === 'test') return
            
            const embed = new MessageEmbed()
                .setColor(palette.info)
                .setTitle(translate(language, 'cmd.help.cmdTitle', `'${cmd.name}'`))
                .setDescription(cmd.description[language]);
            (!cmd.status || !cmd.globalStatus) && embed.setFooter({ text: translate(language, 'cmd.globalStatus') });
            embed.setTimestamp();

            return interaction.reply({
                embeds: [embed]
            })
        }
        const categoriesArray = getCommandCategories()
        const categories: any = {}
        client.commands.forEach(command => {
            if(command.category[0] === 'test') return
            assignNestedObjects(categories, [...command.category, 'commands'], command);
        });

        const defaultPage = interaction.options.getString('category') || 'Help';
        const embeds: MessageEmbed[] = [];
        
        for await(const category of Object.keys(categories)) {
            const fields: EmbedFieldData[] = [];
            if(category === 'Help') {
                const commandCount = client.application?.commands.cache.size
                const guildCount = (await client.guilds.fetch()).size
                const profileCount = await ProfileModel.countDocuments()
                
                fields.push({
                    name: translate(language, 'help.help.updateTitle'),
                    value: translate(language, 'help.help.updateList')
                })
                fields.push({
                    name: translate(language, 'help.help.comingSoonTitle'),
                    value: translate(language, 'help.help.comingSoonList')
                })
                fields.push({
                    name: translate(language, 'help.help.statTitle'),
                    value: translate(language, 'help.help.statList', commandCount, guildCount, profileCount)
                })
            }
            const subcategories = Object.keys(categories[category]);
            const commands = subcategories.map(subcat => {
                if(subcat !== 'commands') {
                    fields.push({
                        name: capitalize(subcat),
                        value: categories[category][subcat]['commands'].map((command: BaseCommand) => `${Formatters.inlineCode(command.name)} ${command.description[language]}`).join('\n')
                    });
                } else
                    return categories[category][subcat].map((command: BaseCommand) => `${Formatters.inlineCode(command.name)} ${command.description[language]}`).join('\n')
            }).join('\n')

            const embed = new MessageEmbed()
                .setColor(palette.info)
                .setTitle(capitalize(category))
                .setFooter({ text: translate(language, 'cmd.help.footer') })
                .setTimestamp()
            category !== 'Help' && embed.setDescription(commands)
            fields.length && embed.addFields(fields)

            embeds.push(embed);
        }

        const moduleEmbed = new MessageEmbed()
            .setColor(palette.info)
            .setTitle(translate(language, 'help.module.title'))
            .setFooter({ text: translate(language, 'cmd.help.footer') })
            .setTimestamp()
            .addField(translate(language, 'help.module.autoRole.name'), translate(language, 'help.module.autoRole.value'))
            .addField(translate(language, 'help.module.reactionRoles.name'), translate(language, 'help.module.reactionRoles.value'))
            .addField(translate(language, 'help.module.xpSystem.name'), translate(language, 'help.module.xpSystem.value'))
            .addField(translate(language, 'help.module.embedMessages.name'), translate(language, 'help.module.embedMessages.value'))
            .addField(translate(language, 'help.module.welcomeMessages.name'), translate(language, 'help.module.welcomeMessages.value'))

        embeds.splice(1, 0, moduleEmbed)

        const menuOptions = categoriesArray.map((category, index) => ({
            label: category,
            value: category,
            default : defaultPage === category ? true : false,
        }));

        const menuComponent = new MessageSelectMenu()
            .addOptions(menuOptions)
            .setPlaceholder(translate(language, 'cmd.help.selectMenuPlaceholder'))
            .setCustomId('helpMenu');

        const component = new MessageActionRow()
            .addComponents(menuComponent)

        const filter = (helpInteraction: MessageComponentInteraction) => helpInteraction.isSelectMenu() && helpInteraction.user.id === interaction.user.id;

        await interaction.reply({
            embeds: [embeds[categoriesArray.indexOf(defaultPage)]],
            components: [component]
        })

        const repliedMessage = await interaction.fetchReply()
        if(!('createMessageComponentCollector' in repliedMessage)) return

        const menuCollector = repliedMessage.createMessageComponentCollector({ filter, time: 60000 })

        menuCollector.on('collect', async (interaction: SelectMenuInteraction) => {
            const selected = interaction.values[0]
            const embed = embeds[categoriesArray.indexOf(selected)]

            menuComponent.options.forEach(option => {
                option.default = false
            })
            const selectedOption = menuComponent.options.find(option => option.value === selected)
            if(!selectedOption) return
            selectedOption.default = true
            component.components = [menuComponent]
            
            await interaction.update({ embeds: [embed], components: [component] });
        });
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        const category = interaction.options.getString('category')
        const input = interaction.options.getString('command', true)

        const options = client.commands.filter(command => (category ? command.category[0] === category : true) && (command.name.includes(input) || false)).map(command => ({
            name: command.name,
            value: command.name
        }))
        
        return interaction.respond(options.splice(0, 25))
    }
}