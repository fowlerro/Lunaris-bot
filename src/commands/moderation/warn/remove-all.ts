import { CommandInteraction, Formatters, MessageEmbed } from 'discord.js';

import Mod from '@modules/Mod';
import { handleCommandError } from '@commands/errors';
import { palette } from '@utils/utils';

import type { Language } from 'types';

export default async function (interaction: CommandInteraction, language: Language) {
	if (!interaction.guildId) return;
	const res = await Mod.warn.remove(interaction.guildId, 'all', interaction.user.id);
	console.log(res.error);
	if (!res.action) return handleCommandError(interaction, 'general.error');

	const embed = new MessageEmbed()
		.setColor(palette.success)
		.setDescription(
			t('command.warn.removeAll', language, { executor: Formatters.memberNicknameMention(interaction.user.id) })
		);

	return interaction
		.reply({
			embeds: [embed],
		})
		.catch(logger.error);
}
