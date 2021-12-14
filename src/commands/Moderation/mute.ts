import { CommandInteraction, MessageEmbed } from "discord.js";

import BaseCommand from "../../utils/structures/BaseCommand";
import Guilds from "../../modules/Guilds";
import Mod from "../../modules/Mod";
import { translate } from "../../utils/languages/languages";
import { palette } from "../../utils/utils";
import ms from "ms";
import Embeds from "../../modules/Embeds";

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
                            type: 'STRING'
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
                {
                    name: 'list',
                    description: 'Shows list of muted members of this server',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'page',
                            description: 'The page, which will be shown, in situation list of mutes will be paginated',
                            type: 'INTEGER'
                        }
                    ]
                }
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guild) return
        const subcommand = interaction.options.getSubcommand(true) as 'give' | 'remove' | 'list'
        const { language } = await Guilds.config.get(interaction.guildId);

        if(subcommand === 'give') {
            const member = interaction.options.getMember('member', true)
            if(!('id' in member)) return 
            const userTime = interaction.options.getString('time')
            const reason = interaction.options.getString('reason') || undefined
            let time = 0
            if(userTime && userTime.match(regex))
                for(const entry of userTime.match(regex)!) time += ms(entry)


            const result = await Mod.mute.add(interaction.guildId, member.id, reason, interaction.user.id, time);

            const description = result.error === 'missingPermission' ? 
                `${translate(language, 'permissions.missingPermission')}: ${result.perms}`
                : result.error === 'targetNotManagable' ? translate(language, 'autoMod.notManagable', `<@${member.id}>`)
                : translate(language, 'autoMod.mute.addMute', `<@${member.id}>`, `<@${interaction.user.id}>`, reason ? `| ${reason}` : "")

            const embed = new MessageEmbed()
                .setColor(result.error ? palette.error : palette.success)
                .setDescription(description);
                
            return interaction.reply({
                embeds: [embed],
                ephemeral: Boolean(result.error)
            })
        }

        if(subcommand === 'remove') {
            const member = interaction.options.getMember('member', true)
            if(!('id' in member)) return
            const reason = interaction.options.getString('reason') || undefined

            const result = await Mod.mute.remove(interaction.guildId, interaction.user.id, member.id, reason);

            if(result.error === "notMuted") {
                const embed = new MessageEmbed()
                    .setColor(palette.error)
                    .setDescription(translate(language, 'autoMod.mute.notMuted', `<@${member.id}>`));
    
                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }

            const description = result.error === 'missingPermission' ?
                `${translate(language, 'permissions.missingPermission')}: ${result.perms}`
                : result.error === 'targetNotManagable' ? translate(language, 'autoMod.notManagable', `<@${member.id}>`)
                : translate(language, 'autoMod.mute.removeMute', `<@${member.id}>`, `<@${interaction.user.id}>`)
            
            const embed = new MessageEmbed()
                .setColor(result.error ? palette.error : palette.success)
                .setDescription(description);

            return interaction.reply({
                embeds: [embed],
                ephemeral: Boolean(result.error)
            })
        }

        if(subcommand === 'list') {
            const { language } = await Guilds.config.get(interaction.guildId);
            const mutes = await Mod.mute.list(interaction.guildId)
            let formattedMutes: any;
            const page = interaction.options.getInteger('page') || 1

            if(!mutes.error && mutes.mutedMembers) {
                const mutesPromises = await mutes.mutedMembers.map(async member => {
                    const date = new Intl.DateTimeFormat(language, {dateStyle: 'short', timeStyle: 'short'}).format(member.mute.date!);
                    let executor = member.mute.executorId!
                    if(!isNaN(+executor)) {
                        const executorUser = await client.users.fetch(executor).catch(() => {})
                        if(!executorUser) return
                        executor = executorUser.tag
                    }

                    const user = await client.users.fetch(member.userId).catch(() => {})
                    if(!user) return
                    const userNick = user.tag

                    return {
                        name: `Nick: ${userNick}`,
                        value: `**Mod**: ${executor}
                                **${translate(language, 'general.reason')}**: ${member.mute.reason ? member.mute.reason : translate(language, 'general.none')}
                                **${translate(language, 'general.date')}**: ${date}`,
                        inline: true
                    }
                });

                formattedMutes = await Promise.all(mutesPromises);
                // ! Check if (fieldIndex % 3 === 0) blank; will looks better
            }


            const embed = new MessageEmbed()
                .setColor(palette.info)
                .setAuthor(translate(language, 'autoMod.mute.muteList'), interaction.guild.iconURL() || undefined)
                .setTimestamp();

            mutes.error ? embed.setDescription(mutes.error) : embed.addFields(formattedMutes);

            const embeds = Embeds.checkLimits(embed, true, 9)
            if(embeds.error)
                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })

            Embeds.pageInteractionEmbeds(null, embeds.pages, interaction, page, true)
        }
    }
}