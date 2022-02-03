import { AutocompleteInteraction, CommandInteraction, EmbedFieldData, Formatters, MessageActionRow, MessageComponentInteraction, MessageEmbed, MessageSelectMenu, SelectMenuInteraction } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";
import { ProfileModel } from "../../database/schemas/Profile";
import { assignNestedObjects, capitalize, getCommandCategories, getLocale, palette } from "../../utils/utils";

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
        const language = getLocale(interaction.guildLocale)

        const command = interaction.options.getString('command')

        if(command) {
            let cmd = client.commands.get(command)
            if(!cmd || cmd.category[0] === 'test') return
            
            const embed = new MessageEmbed()
                .setColor(palette.info)
                .setTitle(t('command.help.cmdTitle', language, { commandName: `'${cmd.name}'` }))
                .setDescription(cmd.description[language]);
            (!cmd.status || !cmd.globalStatus) && embed.setFooter({ text: t('command.globalStatus', language) });
            embed.setTimestamp();

            return interaction.reply({
                embeds: [embed]
            }).catch(logger.error)
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
                const commandCount = client.application?.commands.cache.size.toString() || "0"
                const guildCount = (await client.guilds.fetch()).size.toString()
                const profileCount = await (await ProfileModel.countDocuments()).toString()
                
                fields.push({
                    name: t('help.help.updateTitle', language),
                    value: t('help.help.updateList', language)
                })
                fields.push({
                    name: t('help.help.comingSoonTitle', language),
                    value: t('help.help.comingSoonList', language)
                })
                fields.push({
                    name: t('help.help.statTitle', language),
                    value: t('help.help.statList', language, { commandCount, guildCount, profileCount })
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
                .setFooter({ text: t('command.help.footer', language) })
                .setTimestamp()
            category !== 'Help' && embed.setDescription(commands)
            fields.length && embed.addFields(fields)

            embeds.push(embed);
        }

        const moduleEmbed = new MessageEmbed()
            .setColor(palette.info)
            .setTitle(t('help.module.title', language))
            .setFooter({ text: t('command.help.footer', language) })
            .setTimestamp()
            .addField(t('help.module.autoRole.name', language), t('help.module.autoRole.value', language))
            .addField(t('help.module.reactionRoles.name', language), t('help.module.reactionRoles.value', language))
            .addField(t('help.module.xpSystem.name', language), t('help.module.xpSystem.value', language))
            .addField(t('help.module.embedMessages.name', language), t('help.module.embedMessages.value', language))
            .addField(t('help.module.welcomeMessages.name', language), t('help.module.welcomeMessages.value', language))

        embeds.splice(1, 0, moduleEmbed)

        const menuOptions = categoriesArray.map((category, index) => ({
            label: category,
            value: category,
            default : defaultPage === category ? true : false,
        }));

        const menuComponent = new MessageSelectMenu()
            .addOptions(menuOptions)
            .setPlaceholder(t('command.help.selectMenuPlaceholder', language))
            .setCustomId('helpMenu');

        const component = new MessageActionRow()
            .addComponents(menuComponent)

        const filter = (helpInteraction: MessageComponentInteraction) => helpInteraction.isSelectMenu() && helpInteraction.user.id === interaction.user.id;

        await interaction.reply({
            embeds: [embeds[categoriesArray.indexOf(defaultPage)]],
            components: [component]
        }).catch(logger.error)

        const repliedMessage = await interaction.fetchReply().catch(logger.error)
        if(!repliedMessage) return
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
            
            await interaction.update({ embeds: [embed], components: [component] }).catch(logger.error)
        });
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        const category = interaction.options.getString('category')
        const input = interaction.options.getString('command', true)

        const options = client.commands.filter(command => (category ? command.category[0] === category : true) && (command.name.includes(input) || false)).map(command => ({
            name: command.name,
            value: command.name
        }))
        
        return interaction.respond(options.splice(0, 25)).catch(logger.error)
    }
}