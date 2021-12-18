import { CommandInteraction, MessageEmbed, Permissions, Snowflake } from "discord.js";
import BaseCommand from "../../utils/structures/BaseCommand";
import Guilds from "../../modules/Guilds";
import Mod from "../../modules/Mod";
import { translate } from "../../utils/languages/languages";
import { palette } from "../../utils/utils";
import ms from "ms";
import Embeds from "../../modules/Embeds";

const regex = /[0-9]+[d|h|m|s]/g

export default class BanCommand extends BaseCommand {
    constructor() {
        super(
            'ban',
            'CHAT_INPUT',
            {
                en: "Bans user",
                pl: "Banuje użytkownika"
            },
            [
                {
                    name: 'give',
                    description: 'Gives the ban',
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'member',
                            description: "Member to ban",
                            type: 'USER',
                            required: true
                        },
                        {
                            name: 'time',
                            description: "For how long the ban will be given, e.g. 1d 5h 30m 30s",
                            type: 'STRING'
                        },
                        {
                            name: 'reason',
                            description: "Reason for the ban",
                            type: 'STRING' // TODO Limit string length
                        },
                    ]
                },
                {
                    name: 'give-by-id',
                    description: "Gives the ban by the user's id",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'user-id',
                            description: "User's id to ban",
                            type: 'STRING',
                            required: true
                        },
                        {
                            name: 'time',
                            description: "For how long the ban will be given, e.g. 1d 5h 30m 30s",
                            type: 'STRING'
                        },
                        {
                            name: 'reason',
                            description: "Reason for the ban",
                            type: 'STRING' // TODO Limit string length
                        },
                    ]
                },
                {
                    name: 'remove',
                    description: "Removes the ban by the user's id",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: 'user-id',
                            description: "User's id to ban",
                            type: 'STRING',
                            required: true,
                            // TODO autocomplete: true
                        },
                        {
                            name: 'reason',
                            description: "Reason for the unban",
                            type: 'STRING', // TODO Limit string length
                        },
                    ]
                },
                // TODO List of bans
                // {
                //     name: 'list',
                //     description: 'Shows list of all bans in this server',
                //     type: 'SUB_COMMAND',
                //     options: [
                //         {
                //             name: 'page',
                //             description: 'The page, which will be shown, in situation list of bans will be paginated',
                //             type: 'INTEGER'
                //         }
                //     ]
                // }
            ]
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guild) return
        if(!('id' in interaction.member)) return
        if(!interaction.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return
        const subcommand = interaction.options.getSubcommand(true)
        const { language } = await Guilds.config.get(interaction.guildId);

        if(subcommand === 'give' || subcommand === 'give-by-id') {
            const userId = interaction.options.getString('user-id')
            if(userId && (isNaN(+userId) || userId.length !== 18)) {
                const embed = new MessageEmbed()
                    .setColor(palette.error)
                    .setDescription(translate(language, 'cmd.wrongId'))
    
                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            const member = interaction.options.getMember('member') || (userId && await client.users.fetch(userId))
            if(!member || !('id' in member)) {
                const embed = new MessageEmbed()
                    .setColor(palette.error)
                    .setDescription(translate(language, 'autoMod.ban.notFound'))

                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            const userTime = interaction.options.getString('time')
            const reason = interaction.options.getString('reason') || undefined
            let time = 0
            if(userTime && userTime.match(regex))
                for(const entry of userTime.match(regex)!) time += ms(entry)

            const result = await Mod.ban.add(member.id, interaction.guildId, interaction.user.id, reason, time);

            const description = result.error === 'missingPermission' ?
                `${translate(language, 'permissions.missingPermission')}: ${result.perms}`
                : result.error === 'targetNotManagable' ? translate(language, 'autoMod.notManagable', `<@${member.id}>`)
                : translate(language, 'autoMod.ban.add', `<@${member.id}>`, `<@${interaction.user.id}>`, reason ? `| ${reason}` : "")

            const embed = new MessageEmbed()
                .setColor(result.error ? palette.error : palette.success)
                .setDescription(description);

            return interaction.reply({
                embeds: [embed],
                ephemeral: Boolean(result.error)
            })
        }
        
        if(subcommand === 'remove') {
            const userId = interaction.options.getString('user-id', true)
            if(isNaN(+userId) || userId.length !== 18) {
                const embed = new MessageEmbed()
                    .setColor(palette.error)
                    .setDescription(translate(language, 'cmd.wrongId'))
    
                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            const member = userId && await client.users.fetch(userId)
            if(!member || !('id' in member)) {
                const embed = new MessageEmbed()
                    .setColor(palette.error)
                    .setDescription(translate(language, 'autoMod.ban.notFound'))

                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                })
            }
            const reason = interaction.options.getString('reason') || undefined

            const result = await Mod.ban.remove(member.id, interaction.guildId, interaction.user.id, reason);

            const description = result.error === 'missingPermission' ?
                `${translate(language, 'permissions.missingPermission')}: ${result.perms}`
                : result.error === 'notBanned' ? translate(language, 'autoMod.ban.notBanned', `<@${member.id}>`)
                : translate(language, 'autoMod.ban.remove', `<@${member.id}>`, `<@${interaction.user.id}>`, reason ? `| ${reason}` : "")

            const embed = new MessageEmbed()
                .setColor(result.error ? palette.error : palette.success)
                .setDescription(description);

            return interaction.reply({ 
                embeds: [embed]
            });
        }
    }
}