import { ApplicationCommandOption, Channel, CommandInteraction, MessageEmbed, TextChannel } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";
import Guilds from "../../modules/Guilds";
import Mod from "../../modules/Mod";
import { translate } from "../../utils/languages/languages";
import { msToTime, palette } from "../../utils/utils";
import ms from "ms";

const regex = /[0-9]+[d|h|m|s]/g

export default class TestCommand extends BaseCommand {
    constructor() {
        super(
            'mute',
            'CHAT_INPUT',
            {
                en: "Mutes user",
                pl: "Wycisza użytkownika"
            },
            [
                {
                    name: 'give',
                    description: 'Gives the mute',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'member',
                            description: "Member to mute",
                            type: 'USER',
                            required: true
                        },
                        {
                            name: 'time',
                            description: "For how long the mute will be given, e.g. 1d 5h 30m 30s",
                            type: 'STRING'
                        },
                        {
                            name: 'reason',
                            description: "Reason for the mute",
                            type: 'STRING'
                        },
                    ]
                },
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        
        const subcommand = interaction.options.getSubcommand(true) as 'give' | 'remove' | 'list'
        const { language } = await Guilds.config.get(interaction.guildId);

        if(subcommand === 'give') {
            const member = interaction.options.getMember('member', true)
            if(!('id' in member)) return 
            const userTime = interaction.options.getString('time')
            const reason = interaction.options.getString('reason') || undefined
            let time = 0
            if(userTime && userTime.match(regex))
                for(const entry of userTime.match(regex)!) time += ms(entry)


            const result = await Mod.mute.add(interaction.guildId, member.id, reason, interaction.user.id, time);

            const description = result.error === 'missingPermission' ? `${translate(language, 'permissions.missingPermission')}: ${result.perms}` : translate(language, 'autoMod.mute.addMute', `<@${member.id}>`, `<@${interaction.user.id}>`, reason ? `| ${reason}` : "")

            const embed = new MessageEmbed()
                .setColor(palette.error)
                .setDescription(description);
                
            interaction.reply({
                embeds: [embed]
            })
        }
    }
}