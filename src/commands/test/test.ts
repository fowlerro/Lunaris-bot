import { CommandInteraction } from "discord.js";
import { GuildProfileDocument } from "../../database/schemas/GuildProfile";
import Profiles from "../../modules/Profiles";
import levelRewards from "../../modules/Levels/levelRewards";

import BaseCommand from "../../utils/structures/BaseCommand";
import Logs from "../../modules/Logs";
import TextFormatter from "../../utils/Formatters/Formatter";

export default class TestCommand extends BaseCommand {
    constructor() {
        super(
            'test',
            'CHAT_INPUT',
            {
                en: 'Testing command',
                pl: 'Komenda testowa'
            },
            [
                {
                    name: 'log',
                    description: 'action',
                    type: 'STRING',
                    required: true
                }
            ],
            true,
            true
        );
    }

    async run(interaction: CommandInteraction) {
        if(!interaction.guildId) return
        if(!interaction.member || !('guild' in interaction.member)) return

        const member = await interaction.guild?.members.fetch("436496789433090070")
        if(!member) return
        const roles = await member.roles.cache.map(role => `<@&${role.id}>`)
        const log = interaction.options.getString('log', true)

        const vars = {
            member: member,
            customs: {
                reason: 'Chuj ci na łeb',
                moderatorId: interaction.member.id,
                moderatorMention: `<@${interaction.member.id}>`,
                unbanDate: `<t:1643398529>`,
                unbanDateR: `<t:1643398529:R>`,
                memberRoles: roles.join(', '),
                memberWarnCount: "6",
                timeoutDate: `<t:1643398529>`,
                timeoutDateR: `<t:1643398529:R>`
            }
        }
        await Logs.log('members', log, interaction.guildId, vars)
        
        interaction.reply({
            content: 'ok', 
            ephemeral: true
        })
    }
}