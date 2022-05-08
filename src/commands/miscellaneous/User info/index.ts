import { Formatters, MessageEmbed } from 'discord.js';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';

import { handleCommandError } from '@commands/errors';
import { palette } from '@utils/utils';

import type { Command } from 'src/typings/command';

export default {
	type: ApplicationCommandTypes.USER,
	name: {
		en: 'User info',
	},
	dm: false,
	permissions: undefined,
	run: async (interaction, language) => {
		const targetMember = await interaction.guild?.members.fetch(interaction.targetId).catch(logger.error);
		if (!targetMember) return handleCommandError(interaction, 'general.error');

		const createdAt = `${Formatters.time(targetMember.user.createdAt)}\n${Formatters.time(
			targetMember.user.createdAt,
			'R'
		)}`;
		const joinedAt = targetMember.joinedAt
			? `${Formatters.time(targetMember.joinedAt)}\n${Formatters.time(targetMember.joinedAt, 'R')}`
			: t('general.unknown', language);

		const embed = new MessageEmbed()
			.setColor(palette.info)
			.setTitle(t('command.userInfo.title', language, { memberTag: targetMember.user.tag }))
			.setDescription(`ID: \`${targetMember.id}\``)
			.addField(t('command.userInfo.createdAt', language), createdAt, true)
			.addField(t('command.userInfo.joinedAt', language), joinedAt, true)
			.addField(t('command.userInfo.avatar', language), Formatters.inlineCode(targetMember.user.displayAvatarURL()))
			.setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }))
			.setTimestamp();

		return interaction
			.reply({
				embeds: [embed],
			})
			.catch(logger.error);
	},
} as Command;
