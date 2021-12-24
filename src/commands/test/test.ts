import { CommandInteraction } from "discord.js";
import { testGuildId } from "../../bot";
import { ProfileModel } from "../../database/schemas/Profile";

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
            [],
            true,
            true
        );
    }

    async run(interaction: CommandInteraction) {


        interaction.reply({
            content: 'ok',
            ephemeral: true
        })
    }
}