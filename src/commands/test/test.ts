import { CommandInteraction } from "discord.js";
import WelcomeMessage from "../../modules/WelcomeMessage";

import BaseCommand from "../../utils/structures/BaseCommand";

import { WelcomeMessageAction } from "types";

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

        const action = interaction.options.getString('action') as WelcomeMessageAction

        await WelcomeMessage.sendMessage(interaction.member, action || 'join')

        interaction.reply({
            content: 'ok',
            ephemeral: true
        })
    }
}