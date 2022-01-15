import { CommandInteraction } from "discord.js";
import TextFormatter from "../../utils/Formatter";

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

        const variables = {
            member: interaction.member
        }

        const formatted = TextFormatter("Welcome {{username}} to {{nickname}} {{serverName}} the server {{{memberId}}} and {{{nickname}}", variables)
        
        console.log(formatted)

        interaction.reply({
            content: 'ok',
            ephemeral: true
        })
    }
}