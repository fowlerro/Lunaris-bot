import { AutocompleteInteraction, CommandInteraction, Formatters, MessageEmbed } from "discord.js";

import Mod from "../../../modules/Mod";
import { getLocale, palette } from "../../../utils/utils";
import type { Language } from "types";

import { wrongId, memberNotFound, missingPermissions } from './give'

export default async (interaction: CommandInteraction) => {
    if(!interaction.guildId) return
    const language = getLocale(interaction.guildLocale)
    const userId = interaction.options.getString('user-id', true)
    if(isNaN(+userId) || userId.length !== 18) return wrongId(interaction, language)

    const member = userId && await client.users.fetch(userId)
    if(!member || !('id' in member)) return memberNotFound(interaction, language)

    const reason = interaction.options.getString('reason') || undefined

    const result = await Mod.ban.remove(member.id, interaction.guildId, interaction.user.id, reason);
    if(result.error === 'missingPermission') return missingPermissions(interaction, language)
    if(result.error === 'notBanned') return notBanned(interaction, language)

    const description = t('command.ban.remove', language, { member: `<@${member.id}>`, executor: `<@${interaction.user.id}>` })

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(description)
        .addField(t('general.reason', language), Formatters.codeBlock(reason || t('general.none', language)))

    return interaction.reply({ 
        embeds: [embed]
    });
}

export async function removeAutocomplete(interaction: AutocompleteInteraction) {
    if(!interaction.guildId || !interaction.guild) return
    const input = interaction.options.getString('user-id', true)
    const bans = await interaction.guild.bans.fetch().catch(console.error)
    if(!bans) return interaction.respond([])

    const options = bans.map(ban => ({
        name: `${ban.user.tag} (${ban.user.id})`,
        value: ban.user.id
    })).filter(option => option.name.includes(input))

    return interaction.respond(options?.splice(0, 25) || [])
}

async function notBanned(interaction: CommandInteraction, language: Language) {
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.ban.notBanned', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}
