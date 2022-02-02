import { CommandInteraction, Formatters, MessageEmbed } from "discord.js";
import ms from "ms";

import Mod from "../../../modules/Mod";
import { getLocale, palette } from "../../../utils/utils";

import type { Language } from 'types'

const regex = /[0-9]+[d|h|m|s]/g

export default async (interaction: CommandInteraction) => {
    if(!interaction.guildId) return
    const language = getLocale(interaction.guildLocale)
    const userId = interaction.options.getString('user-id')
    if(userId && (isNaN(+userId) || userId.length !== 18)) return wrongId(interaction, language)

    const member = interaction.options.getMember('member') || (userId && await client.users.fetch(userId))
    if(!member || !('id' in member)) return memberNotFound(interaction, language)

    const userTime = interaction.options.getString('time')
    const reason = interaction.options.getString('reason') || undefined
    let time = 0
    if(userTime && userTime.match(regex))
        for(const entry of userTime.match(regex)!) time += ms(entry)

    const result = await Mod.ban.add(member.id, interaction.guildId, interaction.user.id, reason, time);
    if(result.error === 'missingPermission') return missingPermissions(interaction, language)
    if(result.error === 'targetNotManageable') return notManageable(interaction, language)
    
    const description = t('command.ban.add', language, { member: `<@${member.id}>`, executor: `<@${interaction.user.id}>` })

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(description)
        
    if(time) embed.addField(t('general.until', language), `${Formatters.time(Math.floor(new Date().getTime() / 1000) + Math.floor(time / 1000))}\n${Formatters.time(Math.floor(new Date().getTime() / 1000) + Math.floor(time / 1000), 'R')}`)
    embed.addField(t('general.reason', language), Formatters.codeBlock(reason || t('general.none', language)))

    return interaction.reply({
        embeds: [embed]
    })
}

export async function wrongId(interaction: CommandInteraction, language: Language) {
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.wrongId', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}

export async function missingPermissions(interaction: CommandInteraction, language: Language) {
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.ban.missingPermissions', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}

async function notManageable(interaction: CommandInteraction, language: Language) {
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.ban.notManageable', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}

export async function memberNotFound(interaction: CommandInteraction, language: Language) {
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.ban.notFound', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}