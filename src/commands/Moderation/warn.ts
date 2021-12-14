import { ApplicationCommandOption, Channel, CommandInteraction, MessageEmbed, TextChannel } from "discord.js";
import Guilds from "../../modules/Guilds";
import { translate } from "../../utils/languages/languages";

import BaseCommand from "../../utils/structures/BaseCommand";
import { palette } from "../../utils/utils";

export default class WarnCommand extends BaseCommand {
    constructor() {
        super(
            'warn',
            'CHAT_INPUT',
            {
                en: "Warns user",
                pl: "Ostrzega użytkownika"
            },
            [
                {
                    name: 'remove',
                    description: 'Removes warn',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'warn-id',
                            description: "Identifier of the warn",
                            type: 'STRING',
                            autocomplete: true,
                            required: true
                        }
                    ]
                },
                // {
                //     name: 'member',
                //     description: 'Member to warn',
                //     type: 'USER',
                //     required: true,
                // },
                // {
                //     name: 'reason',
                //     description: 'Reason for the warn',
                //     type: 'STRING'
                // },
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        

        // interaction.reply({
        //     embeds: [embed]
        // })
    }
}