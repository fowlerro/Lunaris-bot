import { ContextMenuInteraction, Formatters, MessageEmbed } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";
import { getLocale, palette } from "../../utils/utils";
import { handleCommandError } from "../errors";

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
        const targetMember = await interaction.guild?.members.fetch(interaction.targetId).catch(console.error)
        if(!targetMember) return handleCommandError(interaction, 'general.error')

        const language = getLocale(interaction.guildLocale)

        const createdAt = `${Formatters.time(targetMember.user.createdAt)}\n${Formatters.time(targetMember.user.createdAt, 'R')}`
        const joinedAt = targetMember.joinedAt ? 
            `${Formatters.time(targetMember.joinedAt)}\n${Formatters.time(targetMember.joinedAt, 'R')}`
            : t('general.unknown', language)

        const embed = new MessageEmbed()
            .setColor(palette.info)
            .setTitle(t('command.userInfo.title', language, { memberTag: targetMember.user.tag }))
            .setDescription(`ID: \`${targetMember.id}\``)
            .addField(t('command.userInfo.createdAt', language), createdAt, true)
            .addField(t('command.userInfo.joinedAt', language), joinedAt, true)
            .addField(t('command.userInfo.avatar', language), Formatters.inlineCode(targetMember.user.displayAvatarURL()))
            .setThumbnail(targetMember.user.displayAvatarURL())
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        }).catch(console.error)
    }
}