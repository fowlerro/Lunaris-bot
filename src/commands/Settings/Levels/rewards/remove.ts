import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from "discord.js";

import Levels from "../../../../modules/Levels";
import { getLocale, palette } from "../../../../utils/utils";
import { handleCommandError } from "../../../errors";

export default async (interaction: CommandInteraction) => {
    if(!interaction.guildId) return
    const language = getLocale(interaction.guildLocale)
    const rewardId = interaction.options.getString('reward', true)
    const scope = interaction.options.getString('scope', true)
    if(!rewardId) return handleCommandError(interaction, 'command.level.rewards.rewardNotSelected')

    const res = await Levels.removeReward(interaction.guildId, rewardId, scope === 'voice' ? 'voice' : 'text')
    if(!res) return handleCommandError(interaction, 'general.error')

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t('command.level.rewards.remove', language))

    return interaction.reply({
        embeds: [embed]
    }).catch(console.error)
}

export async function removeAutocomplete(interaction: AutocompleteInteraction) {
    if(!interaction.guildId) return
    const language = getLocale(interaction.guildLocale)

    const input = interaction.options.getString('reward', true)
    const scope = interaction.options.getString('scope', true)
    const levelConfig = await Levels.get(interaction.guildId)
    if(!levelConfig) return
    const sortedRewards = levelConfig.rewards[scope === 'voice' ? 'voice' : 'text'].sort((a, b) => b.level - a.level)

    const options = await Promise.all(sortedRewards.map(async reward => {
        const role = reward.roleId ? await interaction.guild?.roles.fetch(reward.roleId).catch(console.error) : null
        return {
            name: `Level: ${reward.level}, ${t('general.role', language)}: ${role ? role.name : t('general.none', language)}, ${t('command.level.rewards.takePreviousRole', language)}: ${t(`general.${reward.takePreviousRole ? 'yes' : 'no'}`, language)}`,
            value: reward._id!
        }
    }))

    return interaction.respond(options.splice(0, 25)).catch(console.error)
}