import { AutocompleteInteraction, CommandInteraction, MessageEmbed } from "discord.js";

import Levels from "../../../../modules/Levels";
import { getLocale, palette } from "../../../../utils/utils";

export default async (interaction: CommandInteraction) => {
    if(!interaction.guildId) return
    const language = getLocale(interaction.guildLocale)
    const rewardId = interaction.options.getString('reward', true)
    const scope = interaction.options.getString('scope', true)
    if(!rewardId) return rewardNotSelected(interaction)

    const res = await Levels.removeReward(interaction.guildId, rewardId, scope === 'voice' ? 'voice' : 'text')
    if(!res) return handleError(interaction)

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(t('command.level.rewards.remove', language))

    return interaction.reply({
        embeds: [embed]
    })
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
        const role = reward.roleId ? await interaction.guild?.roles.fetch(reward.roleId) : null
        return {
            name: `Level: ${reward.level}, ${t('general.role', language)}: ${role ? role.name : t('general.none', language)}, ${t('command.level.rewards.takePreviousRole', language)}: ${t(`general.${reward.takePreviousRole ? 'yes' : 'no'}`, language)}`,
            value: reward._id!
        }
    }))

    return interaction.respond(options.splice(0, 25))
}

async function rewardNotSelected(interaction: CommandInteraction) {
    const language = getLocale(interaction.guildLocale)
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.level.rewards.rewardNotSelected', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}

async function handleError(interaction: CommandInteraction) {
    const language = getLocale(interaction.guildLocale)
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('general.error', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}