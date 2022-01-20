import { CommandInteraction } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";

export default class TestCommand extends BaseCommand {
    constructor() {
        super(
            'test',
            'CHAT_INPUT',
            {
                en: 'Testing command',
                pl: 'Komenda testowa'
            },
            [
                {
                    name: 'action',
                    description: 'action',
                    type: 'STRING'
                }
            ],
            true,
            true
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.member || !('guild' in interaction.member)) return
        
        interaction.reply({
            content: 'ok', 
            ephemeral: true
        })
    }
}