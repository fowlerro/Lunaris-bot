import { CommandInteraction, Formatters, MessageEmbed } from 'discord.js';

import Mod from '@modules/Mod';
import { palette } from '@utils/utils';
import { handleCommandError } from '@commands/errors';

import type { Language } from 'types';

export default async function (interaction: CommandInteraction, language: Language) {
	if (!interaction.guildId) return;
	const member = interaction.options.getMember('member', true);
	if (!('id' in member)) return;
	const reason = interaction.options.getString('reason');

	const result = await Mod.warn.give(interaction.guildId, member.id, interaction.user.id, reason ?? undefined);
	if (!result) return handleCommandError(interaction, 'general.error');

	const embed = new MessageEmbed()
		.setColor(palette.error)
		.setDescription(
			t('command.warn.add', language, { member: `<@${member.id}>`, executor: `<@${interaction.user.id}>` })
		)
		.addField(t('general.reason', language), Formatters.codeBlock(reason || t('general.none', language)));

	return interaction
		.reply({
			embeds: [embed],
		})
		.catch(logger.error);
}
