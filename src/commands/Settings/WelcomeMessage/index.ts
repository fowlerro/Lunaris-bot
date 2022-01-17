import { AutocompleteInteraction, CommandInteraction, Permissions } from "discord.js";

import BaseCommand from "../../../utils/structures/BaseCommand";

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
                    description: "Set channel to which Welcome Messages will be sended",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'channel',
                            description: "Channel",
                            type: 'CHANNEL',
                            required: true,
                            channelTypes: ['GUILD_TEXT']
                        }
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
                }
            ],
            true, true
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