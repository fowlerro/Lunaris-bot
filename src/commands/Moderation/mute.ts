import { CommandInteraction, Formatters, MessageEmbed, Permissions } from "discord.js";
import ms from "ms";

import BaseCommand from "../../utils/structures/BaseCommand";
import Mod from "../../modules/Mod";
import { palette } from "../../utils/utils";

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
        if(!interaction.member.permissions.has(Permissions.FLAGS.MODERATE_MEMBERS)) return noPermissions(interaction)

        const subcommand = interaction.options.getSubcommand(true) as 'give' | 'remove'
        const language = interaction.guildLocale === 'pl' ? 'pl' : 'en'

        if(subcommand === 'give') {
            const member = interaction.options.getMember('member', true)
            if(!('id' in member)) return 
            const userTime = interaction.options.getString('time')
            const reason = interaction.options.getString('reason') || undefined
            let time = 0
            if(userTime && userTime.match(regex))
                for(const entry of userTime.match(regex)!) time += ms(entry)

            if(!time) return incorectTime(interaction)
            const result = await Mod.mute.add(member, interaction.member, time, reason);

            const description = result?.error === 'executorWithoutPermission' ? 
                t('command.mute.executorWithoutPermission', language)
                : result?.error === 'notModeratable' ? t('command.mute.notModeratable', language, { member: `<@${member.id}>` })
                : result?.error === 'alreadyTimedOut' ? t('command.mute.alreadyTimedOut', language)
                : result?.error ? t('command.mute.error', language)
                : t('command.mute.addMute', language, { member: `<@${member.id}>`, executor: `<@${interaction.user.id}>`, reason: reason ? `| ${reason}` : "" })

            const embed = new MessageEmbed()
                .setColor(result?.error ? palette.error : palette.success)
                .setDescription(description)

            if(!result?.error) {
                embed.addField(t('general.until', language), `${Formatters.time(Math.floor(new Date().getTime() / 1000) + Math.floor(time / 1000))}\n${Formatters.time(Math.floor(new Date().getTime() / 1000) + Math.floor(time / 1000), 'R')}`)
                embed.addField(t('general.reason', language), Formatters.codeBlock(reason || t('general.none', language)))
            }
            
                
            return interaction.reply({
                embeds: [embed],
                ephemeral: Boolean(result?.error)
            })
        }

        if(subcommand === 'remove') {
            const member = interaction.options.getMember('member', true)
            if(!('id' in member)) return
            const reason = interaction.options.getString('reason') || undefined

            const result = await Mod.mute.remove(member, interaction.member, reason);

            const description = result?.error === 'executorWithoutPermission' ?
                t('command.mute.executorWithoutPermission', language)
                : result?.error === 'notModeratable' ? t('command.mute.notModeratable', language)
                : result?.error === 'notTimedOut' ? t('command.mute.notTimedOut', language)
                : result?.error ? t('command.mute.error', language)
                : t('command.mute.removeMute', language, { member: `<@${member.id}>`, executor: `<@${interaction.user.id}>` })
            
            const embed = new MessageEmbed()
                .setColor(result?.error ? palette.error : palette.success)
                .setDescription(description)

            !result?.error && embed.addField(t('general.reason', language), Formatters.codeBlock(reason || t('general.none', language)))

            return interaction.reply({
                embeds: [embed],
                ephemeral: Boolean(result?.error)
            })
        }
    }
}

async function noPermissions(interaction: CommandInteraction) {
    const language = interaction.guildLocale === 'pl' ? 'pl' : 'en'
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.mute.executorWithoutPermission', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}

async function incorectTime(interaction: CommandInteraction) {
    const language = interaction.guildLocale === 'pl' ? 'pl' : 'en'
    const embed = new MessageEmbed()
        .setColor(palette.error)
        .setDescription(t('command.mute.incorectTime', language))

    return interaction.reply({
        embeds: [embed],
        ephemeral: true
    })
}