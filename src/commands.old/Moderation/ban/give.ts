import { CommandInteraction, Formatters, MessageEmbed } from "discord.js";
import ms from "ms";

import Mod from "../../../modules/Mod";
import { getLocale, palette } from "../../../utils/utils";
import { handleCommandError } from "../../errors";

const regex = /[0-9]+[d|h|m|s]/g

export default async (interaction: CommandInteraction) => {
    if(!interaction.guildId) return
    const language = getLocale(interaction.guildLocale)
    const userId = interaction.options.getString('user-id')
    if(userId && (isNaN(+userId) || userId.length !== 18)) return handleCommandError(interaction, 'command.wrongId')

    const member = interaction.options.getMember('member') || (userId && await client.users.fetch(userId).catch(logger.error))
    if(!member || !('id' in member)) return handleCommandError(interaction, 'command.ban.notFound')

    const userTime = interaction.options.getString('time')
    const reason = interaction.options.getString('reason') || undefined
    let time = 0
    if(userTime && userTime.match(regex))
        for(const entry of userTime.match(regex)!) time += ms(entry)

    const result = await Mod.ban.add(member.id, interaction.guildId, interaction.user.id, reason, time);
    if(result.error === 'missingPermission') return handleCommandError(interaction, 'command.ban.missingPermissions')
    if(result.error === 'targetNotManageable') return handleCommandError(interaction, 'command.ban.notManageable')
    if(result.error) return handleCommandError(interaction, 'general.error')
    
    const description = t('command.ban.add', language, { member: `<@${member.id}>`, executor: `<@${interaction.user.id}>` })

    const embed = new MessageEmbed()
        .setColor(palette.success)
        .setDescription(description)
        
    if(time) embed.addField(t('general.until', language), `${Formatters.time(Math.floor(new Date().getTime() / 1000) + Math.floor(time / 1000))}\n${Formatters.time(Math.floor(new Date().getTime() / 1000) + Math.floor(time / 1000), 'R')}`)
    embed.addField(t('general.reason', language), Formatters.codeBlock(reason || t('general.none', language)))

    return interaction.reply({
        embeds: [embed]
    }).catch(logger.error)
}