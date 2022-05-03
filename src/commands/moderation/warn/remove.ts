import { CommandInteraction, Formatters, MessageEmbed } from 'discord.js';

import Mod from '@modules/Mod';
import { handleCommandError } from '@commands/errors';
import { palette } from '@utils/utils';

import type { Language } from 'types';

export default async function (interaction: CommandInteraction, language: Language) {
	if (!interaction.guildId) return;
	const member = interaction.options.getMember('member', true);
	if (!('id' in member)) return;
	const warnId = interaction.options.getString('warn', true);

	const warn = await Mod.warn.remove(interaction.guildId, warnId, interaction.user.id, member.id);
	if (warn.error === 'warnNotFound') return handleCommandError(interaction, 'command.warn.notFound');
	if (warn.error === 'targetNotFound') return handleCommandError(interaction, 'command.warn.targetNotFound');
	if (warn.error === 'targetWithoutWarns') return handleCommandError(interaction, 'command.warn.targetWithoutWarns');
	if (warn.error) return handleCommandError(interaction, 'general.error');

	const description =
		warn.action === 'all'
			? t('command.warn.removeAll', language, { executor: Formatters.memberNicknameMention(interaction.user.id) })
			: warn.action === 'targetAll'
			? t('command.warn.removeMemberAll', language, {
					executor: Formatters.memberNicknameMention(interaction.user.id),
					member: Formatters.memberNicknameMention(member.id),
			  })
			: t('command.warn.remove', language, {
					executor: Formatters.memberNicknameMention(interaction.user.id),
					member: Formatters.memberNicknameMention(member.id),
			  });

	const embed = new MessageEmbed().setColor(palette.success).setDescription(description);

	return interaction
		.reply({
			embeds: [embed],
		})
		.catch(logger.error);
}
