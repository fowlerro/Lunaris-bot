import { AutocompleteInteraction, CommandInteraction, MessageEmbed, Permissions } from "discord.js";
import { Language } from "types";
import WelcomeMessage from "../../../modules/WelcomeMessage";
import { translate } from "../../../utils/languages/languages";

import BaseCommand from "../../../utils/structures/BaseCommand";
import { capitalize, palette } from "../../../utils/utils";

import add from "./add";
import _delete, { deleteAutocomplete } from "./delete";
import list from "./list";
import set from "./set";
import status from "./status";

export default class WelcomeMessageCommand extends BaseCommand {
    constructor() {
        super(
            'welcome',
            'CHAT_INPUT',
            {
                en: "Manage Welcome Message Module",
                pl: 'Zarządzanie modułem wiadomości powitalnej'
            },
            [
                {
                    name: 'add',
                    description: "Add welcome message",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'action',
                            description: 'When the message will be sent',
                            type: 'STRING',
                            choices: WelcomeMessage.supportedActions.map(action => ({ name: capitalize(action), value: action })),
                            required: true
                        },
                        {
                            name: 'format',
                            description: 'Message format (Available formats are listed in module help page `/help welcome`)',
                            type: 'STRING',
                            required: true,
                        }
                    ]
                },
                {
                    name: 'delete',
                    description: "Delete welcome message",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'action',
                            description: "Action of message to delete",
                            type: 'STRING',
                            choices: WelcomeMessage.supportedActions.map(action => ({ name: capitalize(action), value: action })),
                            required: true
                        },
                        {
                            name: 'message',
                            description: "Welcome Message to delete",
                            type: 'STRING',
                            required: true,
                            autocomplete: true,
                        }
                    ]
                },
                {
                    name: 'set',
                    description: "Set channel for Welcome Messages",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'action',
                            description: 'Messages for whose channel will be set (Not choosing a channel will disable this action)',
                            type: 'STRING',
                            choices: WelcomeMessage.supportedActions.map(action => ({ name: capitalize(action), value: action })),
                            required: true
                        },
                        {
                            name: 'channel',
                            description: "Channel",
                            type: 'CHANNEL',
                            channelTypes: ['GUILD_TEXT']
                        },
                    ]
                },
                {
                    name: 'status',
                    description: "Display module status and enable/disable it",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'enable',
                            description: "Enable/disable the module",
                            type: 'BOOLEAN'
                        }
                    ]
                },
                {
                    name: 'list',
                    description: "List all added welcome messages",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'action',
                            description: "List of added messages with specified action",
                            type: 'STRING',
                            choices: WelcomeMessage.supportedActions.map(action => ({ name: capitalize(action), value: action })),
                        }
                    ]
                }
            ],
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guildId || !interaction.member) return
        if(!('id' in interaction.member)) return
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return

        const subCommand = interaction.options.getSubcommand(true)
        
        if(subCommand === 'add') return add(interaction)
        if(subCommand === 'delete') return _delete(interaction)
        if(subCommand === 'set') return set(interaction)
        if(subCommand === 'status') return status(interaction)
        if(subCommand === 'list') return list(interaction)
    }

    async autocomplete(interaction: AutocompleteInteraction) {
       return deleteAutocomplete(interaction) 
    }
}

export function handleError(interaction: CommandInteraction, language: Language) {
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(translate(language, 'cmd.welcome.error'));

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}