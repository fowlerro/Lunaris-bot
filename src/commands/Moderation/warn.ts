import { AutocompleteInteraction, CommandInteraction, Formatters, MessageEmbed, Permissions } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";
import Embeds from "../../modules/Embeds";
import Mod from "../../modules/Mod";
import { GuildProfileWarn } from "../../database/schemas/GuildProfile";
import { getLocale, palette } from "../../utils/utils";
import { handleCommandError } from "../errors";

export default class WarnCommand extends BaseCommand {
    constructor() {
        super(
            'warn',
            'CHAT_INPUT',
            {
                en: "Warns user",
                pl: "Ostrzega użytkownika"
            },
            [
                {
                    name: 'give',
                    description: 'Gives a warn',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'member',
                            description: "Member to warn",
                            type: 'USER',
                            required: true
                        },
                        {
                            name: 'reason',
                            description: "Reason for a warn",
                            type: 'STRING',
                            required: true
                        },
                    ]
                },
                {
                    name: 'remove',
                    description: 'Removes warn',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'member',
                            description: "Member whose warn will be removed",
                            type: 'USER',
                            required: true
                        },
                        {
                            name: 'warn',
                            description: "Warn to be removed",
                            type: 'STRING',
                            autocomplete: true,
                            required: true
                        }
                    ]
                },
                {
                    name: 'remove-all',
                    description: 'Removes all warns from this server',
                    type: 'SUB_COMMAND'
                },
                {
                    name: 'list',
                    description: "Shows list of all server's or specified member's warns",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'member',
                            description: "Member whose warns will be shown",
                            type: 'USER'
                        },
                        {
                            name: 'page',
                            description: 'The page, which will be shown, in situation list of warns will be paginated',
                            type: 'INTEGER',
                            minValue: 1
                        }
                    ]
                }
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guildId || !interaction.member) return
        if(!('id' in interaction.member)) return
        if(!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) return handleCommandError(interaction, 'command.executorWithoutPermission')

        const subcommand = interaction.options.getSubcommand(true)
        const language = getLocale(interaction.guildLocale)

        if(subcommand === 'give') {
            const member = interaction.options.getMember('member', true)
            if(!('id' in member)) return
            const reason = interaction.options.getString('reason', true)

            const result = await Mod.warn.give(interaction.guildId, member.id, interaction.user.id, reason)
            if(!result) return handleCommandError(interaction, 'general.error')

            const embed = new MessageEmbed()
                .setColor(palette.error)
                .setDescription(t('command.warn.add', language, { member: `<@${member.id}>`, executor: `<@${interaction.user.id}>` }))
                .addField(t('general.reason', language), Formatters.codeBlock(reason || t('general.none', language)))
            
            return interaction.reply({
                embeds: [embed]
            }).catch(logger.error)
        }

        if(subcommand === 'remove') {
            const member = interaction.options.getMember('member', true)
            if(!('id' in member)) return
            const warnId = interaction.options.getString('warn', true)
            
            const warn = await Mod.warn.remove(interaction.guildId, warnId, interaction.user.id, member.id)
            if(warn.error === 'warnNotFound') return handleCommandError(interaction, 'command.warn.notFound')
            if(warn.error === 'targetNotFound') return handleCommandError(interaction, 'command.warn.targetNotFound')
            if(warn.error === 'targetWithoutWarns') return handleCommandError(interaction, 'command.warn.targetWithoutWarns')
            if(warn.error) return handleCommandError(interaction, 'general.error')
            
            const description = warn.action === 'all' ? 
                t('command.warn.removeAll', language,  { executor: Formatters.memberNicknameMention(interaction.user.id) })
                : warn.action === 'targetAll' ? t('command.warn.removeMemberAll', language, { executor: Formatters.memberNicknameMention(interaction.user.id), member: Formatters.memberNicknameMention(member.id) })
                : t('command.warn.remove', language, { executor: Formatters.memberNicknameMention(interaction.user.id), member: Formatters.memberNicknameMention(member.id) })

            const embed = new MessageEmbed()
                .setColor(palette.success)
                .setDescription(description)
            
            return interaction.reply({
                embeds: [embed]
            }).catch(logger.error)
        }

        if(subcommand === 'remove-all') {
            const res = await Mod.warn.remove(interaction.guildId, 'all', interaction.user.id)
            if(!res.action) return handleCommandError(interaction, 'general.error')

            const embed = new MessageEmbed()
                .setColor(palette.success)
                .setDescription(t('command.warn.removeAll', language, { executor: Formatters.memberNicknameMention(interaction.user.id) }))

            return interaction.reply({
                embeds: [embed]
            }).catch(logger.error)
        }

        if(subcommand === 'list') {
            const user = interaction.options.getUser('member')
            const page = interaction.options.getInteger('page') || 1

            const result = await Mod.warn.list(interaction.guildId, user?.id || undefined)
            if(result.error) return handleCommandError(interaction, 'general.error')
            let embedFields: any[] = []

            if(result.warns.length) {
                embedFields = (await Promise.all(result.warns.map(async profile => {
    
                    if('warns' in profile) return Promise.all(profile.warns.map(async warn => {
                        // const date = new Intl.DateTimeFormat(language, { dateStyle: 'short', timeStyle: 'short' }).format(warn.date);
                        
                        let executor = warn.executorId
                        if(!isNaN(+executor)) {
                            const executorUser = await client.users.fetch(executor).catch(logger.error)
                            if(!executorUser) return
                            executor = executorUser.tag
                        }

                        const user = await client.users.fetch(profile.userId).catch(logger.error)
                        if(!user) return
                        const userNick = user.tag
    
                        return {
                            name: `Nick: ${userNick}`,
                            value: `**Mod**: ${executor}
                                    **${t('general.reason', language)}**: ${warn.reason}
                                    **${t('general.date', language)}**: ${Formatters.time(new Date(warn.date))}`,
                            inline: true
                        }
                    }));

                    // const date = new Intl.DateTimeFormat(language, {dateStyle: 'short', timeStyle: 'short'}).format(profile.date);

                    let executor = profile.executorId
                        if(!isNaN(+executor)) {
                            const executorUser = await client.users.fetch(executor).catch(logger.error)
                            if(!executorUser) return
                            executor = executorUser.tag
                        }
    
                    return {
                        name: `Mod: ${executor}`,
                        value: `**${t('general.reason', language)}**: ${profile.reason}
                                **${t('general.date', language)}**: ${Formatters.time(new Date(profile.date))}`,
                        inline: true
                    }
                }))).flat();
            }

            const embedAuthor = user ? t('command.warn.list', language, { userTag: user.tag }) : t('command.warn.guildList', language);
            
            const embed = new MessageEmbed()
                .setColor(palette.info)
                .setAuthor({ name: embedAuthor, iconURL: interaction.guild?.iconURL() || undefined })
                .setTimestamp();

            if(!embedFields.length) embed.setDescription(t('general.none', language))
            if(embedFields.length) embed.addFields(embedFields)
            
            const embeds = Embeds.checkLimits(embed, true, 9)
            if(embeds.error) return handleCommandError(interaction, 'general.error')

            Embeds.pageInteractionEmbeds(null, embeds.pages, interaction, page, true)
        }
    }

    async autocomplete(interaction: AutocompleteInteraction) {
        if(!interaction.guildId || !interaction.guild) return
        const memberId = interaction.options.get('member', true).value as string
        const member = await interaction.guild.members.fetch(memberId).catch(logger.error)

        const language = getLocale(interaction.guildLocale)

        const input = interaction.options.getString('warn', true)
        if(!member || !('id' in member)) return

        const { warns, error } = await Mod.warn.list(interaction.guildId, member.id)
        if(!warns.length || error) return

        const options = (warns as GuildProfileWarn[]).filter(warn => (warn.reason?.includes(input) || false)).map(warn => ({
            name: `${warn.reason} | ${new Date(warn.date).toLocaleString()}`,
            value: warn._id
        }))

        options.unshift({ name: t('command.warn.optionAll', language), value: 'targetAll' })

        return interaction.respond(options.splice(0, 25)).catch(logger.error)
    }
}