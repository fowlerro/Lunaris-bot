import { CommandInteraction, Permissions } from "discord.js";

import BaseCommand from "../../../utils/structures/BaseCommand";

import add from "./add";
import list from "./list";

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
        if(subCommand === 'list') return list(interaction)
    }
}