import { ContextMenuInteraction, Formatters, MessageEmbed } from "discord.js";
import Guilds from "../../modules/Guilds";
import { translate } from "../../utils/languages/languages";

import BaseCommand from "../../utils/structures/BaseCommand";
import { palette } from "../../utils/utils";

export default class UserInfoCommand extends BaseCommand {
    constructor() {
        super(
            'User info',
            'USER',
            {
                en: "",
                pl: ""
            },
        );
    }

    async run(interaction: ContextMenuInteraction) {
        const targetMember = await interaction.guild?.members.fetch(interaction.targetId).catch(() => {})
        if(!targetMember) return;
        const guildConfig = await Guilds.config.get(interaction.guildId!)
        const language = guildConfig.language

        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setTitle(translate(language, 'cmd.userInfo.title', targetMember.user.tag))
            .setDescription(`ID: \`${targetMember.id}\``)
            .addField(translate(language, 'cmd.userInfo.createdAt'), targetMember.user.createdAt.toLocaleString(), true)
            .addField(translate(language, 'cmd.userInfo.joinedAt'), targetMember.joinedAt?.toLocaleString() || 'Unknown', true)
            .addField(translate(language, 'cmd.userInfo.avatar'), Formatters.inlineCode(targetMember.user.displayAvatarURL()))
            .setThumbnail(targetMember.user.displayAvatarURL())
            .setTimestamp();

        interaction.reply({
            embeds: [embed],
        })
    }
}