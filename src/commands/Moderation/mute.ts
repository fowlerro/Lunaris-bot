import { CommandInteraction, Formatters, MessageEmbed, Permissions } from "discord.js";
import ms from "ms";

import BaseCommand from "../../utils/structures/BaseCommand";
import Mod from "../../modules/Mod";
import { getLocale, palette } from "../../utils/utils";
import { handleCommandError } from "../errors";

const regex = /[0-9]+[d|h|m|s]/g

export default class MuteCommand extends BaseCommand {
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
                    description: 'Mutes member',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'member',
                            description: "Member to be muted",
                            type: 'USER',
                            required: true
                        },
                        {
                            name: 'time',
                            description: "For how long the mute will be given, e.g. 1d 5h 30m 30s",
                            type: 'STRING',
                            required: true
                        },
                        {
                            name: 'reason',
                            description: "Reason for the mute",
                            type: 'STRING' // TODO Limit string length
                        },
                    ]
                },
                {
                    name: 'remove',
                    description: 'Removes the mute',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'member',
                            description: "Member to be unmuted",
                            type: 'USER',
                            required: true,
                            // TODO autocomplete: true
                        },
                        {
                            name: 'reason',
                            description: "Reason for the unmute",
                            type: 'STRING', // TODO Limit string length
                        },
                    ]
                },
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guild || !interaction.guildId || !interaction.member) return
        if(!('id' in interaction.member)) return
        if(!interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return handleCommandError(interaction, 'command.executorWithoutPermission')

        const subcommand = interaction.options.getSubcommand(true) as 'give' | 'remove'
        const language = getLocale(interaction.guildLocale)

        if(subcommand === 'give') {
            const member = interaction.options.getMember('member', true)
            if(!('id' in member)) return handleCommandError(interaction, 'general.error')
            const userTime = interaction.options.getString('time')
            const reason = interaction.options.getString('reason') || undefined
            let time = 0
            if(userTime && userTime.match(regex))
                for(const entry of userTime.match(regex)!) time += ms(entry)

            if(!time) return handleCommandError(interaction, 'command.mute.incorectTime')
            const result = await Mod.mute.add(member, interaction.member, time, reason);
            if(result?.error === 'executorWithoutPermissions') return handleCommandError(interaction, 'command.executorWithoutPermission')
            if(result?.error === 'notModeratable') return handleCommandError(interaction, 'command.mute.notModeratable')
            if(result?.error === 'alreadyTimedOut') return handleCommandError(interaction, 'command.mute.alreadyTimedOut')
            if(result?.error) return handleCommandError(interaction, 'general.error')

            const description = t('command.mute.addMute', language, { member: `<@${member.id}>`, executor: `<@${interaction.user.id}>` })

            const embed = new MessageEmbed()
                .setColor(palette.success)
                .setDescription(description)
                .addField(t('general.until', language), `${Formatters.time(Math.floor(new Date().getTime() / 1000) + Math.floor(time / 1000))}\n${Formatters.time(Math.floor(new Date().getTime() / 1000) + Math.floor(time / 1000), 'R')}`)
                .addField(t('general.reason', language), Formatters.codeBlock(reason || t('general.none', language)))
                
            return interaction.reply({
                embeds: [embed]
            }).catch(console.error)
        }

        if(subcommand === 'remove') {
            const member = interaction.options.getMember('member', true)
            if(!('id' in member)) return
            const reason = interaction.options.getString('reason') || undefined

            const result = await Mod.mute.remove(member, interaction.member, reason)
            if(result?.error === 'executorWithoutPermissions') return handleCommandError(interaction, 'command.executorWithoutPermission')
            if(result?.error === 'notModeratable') return handleCommandError(interaction, 'command.mute.notModeratable')
            if(result?.error === 'notTimedOut') return handleCommandError(interaction, 'command.mute.notTimedOut')
            if(result?.error) return handleCommandError(interaction, 'general.error')

            const description = t('command.mute.removeMute', language, { member: `<@${member.id}>`, executor: `<@${interaction.user.id}>` })
            
            const embed = new MessageEmbed()
                .setColor(palette.success)
                .setDescription(description)
                .addField(t('general.reason', language), Formatters.codeBlock(reason || t('general.none', language)))

            return interaction.reply({
                embeds: [embed]
            }).catch(console.error)
        }
    }
}