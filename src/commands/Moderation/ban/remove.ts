import { AutocompleteInteraction, CommandInteraction, Formatters, MessageEmbed } from "discord.js";

import Mod from "../../../modules/Mod";
import { getLocale, palette } from "../../../utils/utils";
import { handleCommandError } from "../../errors";

export default async (interaction: CommandInteraction) => {
    if(!interaction.guildId) return
    const language = getLocale(interaction.guildLocale)
    const userId = interaction.options.getString('user-id', true)
    if(isNaN(+userId) || userId.length !== 18) return handleCommandError(interaction, 'command.wrongId')

    const member = userId && await client.users.fetch(userId)
    if(!member || !('id' in member)) return handleCommandError(interaction, 'command.ban.notFound')

    const reason = interaction.options.getString('reason') || undefined

    const result = await Mod.ban.remove(member.id, interaction.guildId, interaction.user.id, reason);
    if(result.error === 'missingPermission') return handleCommandError(interaction, 'command.ban.missingPermissions')
    if(result.error === 'notBanned') return handleCommandError(interaction, 'command.ban.notBanned')
    if(result.error) return handleCommandError(interaction, 'general.error')

    const description = t('command.ban.remove', language, { member: `<@${member.id}>`, executor: `<@${interaction.user.id}>` })

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(description)
        .addField(t('general.reason', language), Formatters.codeBlock(reason || t('general.none', language)))

    return interaction.reply({ 
        embeds: [embed]
    }).catch(console.error)
}

export async function removeAutocomplete(interaction: AutocompleteInteraction) {
    if(!interaction.guildId || !interaction.guild) return
    const input = interaction.options.getString('user-id', true)
    const bans = await interaction.guild.bans.fetch().catch(console.error)
    if(!bans) return interaction.respond([]).catch(console.error)

    const options = bans.map(ban => ({
        name: `${ban.user.tag} (${ban.user.id})`,
        value: ban.user.id
    })).filter(option => option.name.includes(input))

    return interaction.respond(options?.splice(0, 25) || []).catch(console.error)
}