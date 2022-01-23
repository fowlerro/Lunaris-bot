import { CommandInteraction } from "discord.js";
import { GuildConfigModel } from "../../database/schemas/GuildConfig";

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

        const guilds = await GuildConfigModel.find({})

        guilds.forEach(async guild => {
            const g = await client.guilds.fetch(guild.guildId)
            console.log(g)
        })
        
        interaction.reply({
            content: 'ok', 
            ephemeral: true
        })
    }
}