import { CommandInteraction } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";

export default class TestCommand extends BaseCommand {
    constructor() {
        super(
            'test',
            {
                en: 'Testing command',
                pl: 'Komenda testowa'
            },
        );
    }

    async run(interaction: CommandInteraction) {
        interaction.reply({
            content: 'ok',
            ephemeral: true
        })
    }
}