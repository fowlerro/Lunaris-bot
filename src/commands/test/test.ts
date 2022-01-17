import { CommandInteraction } from "discord.js";
import WelcomeMessage from "../../modules/WelcomeMessage";

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
        if(!interaction.member || !('guild' in interaction.member)) return

        await WelcomeMessage.sendJoinMessage(interaction.member)

        interaction.reply({
            content: 'ok',
            ephemeral: true
        })
    }
}