import { AutocompleteInteraction, CommandInteraction, Permissions } from "discord.js";

import BaseCommand from "../../../utils/structures/BaseCommand";
import templates from "../../../modules/Logs/templates";

import set from "./set";
import toggle, { autocompleteToggle } from "./toggle";
import status from "./status";
import { handleCommandError } from "../../errors";

export default class LogsCommand extends BaseCommand {
    constructor() {
        super(
            'logs',
            'CHAT_INPUT',
            {
                en: "Manage server logs",
                pl: "Zarządzaj logami serwerowymi"
            },
            [
                {
                    name: 'status',
                    description: 'Display logs status',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'category',
                            description: "Status of logs in category",
                            type: 'STRING',
                            choices: Object.keys(templates).map(category => ({ name: category, value: category }))
                        },
                    ]
                },
                {
                    name: 'channel',
                    description: 'Set channel for logs',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'category',
                            description: "Logs category",
                            type: 'STRING',
                            choices: Object.keys(templates).map(category => ({ name: category, value: category })),
                            required: true
                        },
                        {
                            name: 'channel',
                            description: "Channel for logs, leave blank to disable whole category of logs",
                            type: 'CHANNEL',
                            channelTypes: ['GUILD_TEXT']
                        },
                    ]
                },
                {
                    name: 'toggle',
                    description: 'Enable or disable specific logs',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'category',
                            description: "Logs category",
                            type: 'STRING',
                            choices: Object.keys(templates).map(category => ({ name: category, value: category })),
                            required: true
                        },
                        {
                            name: 'log',
                            description: "Specific log to toggle",
                            type: 'STRING',
                            required: true,
                            autocomplete: true
                        },
                        {
                            name: 'value',
                            description: "If you want to enable or disable this log",
                            type: 'BOOLEAN',
                            required: true
                        }
                    ]
                }
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guild || !interaction.guildId || !interaction.member) return
        if(!('id' in interaction.member)) return
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return handleCommandError(interaction, 'command.executorWithoutPermission')
        const subcommand = interaction.options.getSubcommand(true)
    
        if(subcommand === 'status') return status(interaction)
        if(subcommand === 'channel') return set(interaction)
        if(subcommand === 'toggle') return toggle(interaction)
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        autocompleteToggle(interaction)
    }
}