import { CommandInteraction, MessageEmbed } from "discord.js";
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

        const embed = new MessageEmbed()
            .setImage('https://cdn.discordapp.com/avatars/313346190995619841/4164c45f723be7ae03e665181ec7ef33.webp', )


        interaction.reply({
            content: 'ok',
            ephemeral: true
        })
    }
}