import { ContextMenuInteraction, Formatters, MessageEmbed } from "discord.js";

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

        const language = interaction.guildLocale === 'pl' ? 'pl' : 'en'

        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setTitle(t('command.userInfo.title', language, { memberTag: targetMember.user.tag }))
            .setDescription(`ID: \`${targetMember.id}\``)
            .addField(t('command.userInfo.createdAt', language), targetMember.user.createdAt.toLocaleString(), true)
            .addField(t('command.userInfo.joinedAt', language), targetMember.joinedAt?.toLocaleString() || 'Unknown', true)
            .addField(t('command.userInfo.avatar', language), Formatters.inlineCode(targetMember.user.displayAvatarURL()))
            .setThumbnail(targetMember.user.displayAvatarURL())
            .setTimestamp();

        interaction.reply({
            embeds: [embed],
        })
    }
}