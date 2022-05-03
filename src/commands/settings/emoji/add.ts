import { CommandInteraction, MessageEmbed } from 'discord.js';

import { handleCommandError } from '@commands/errors';
import { palette } from '@utils/utils';
import type { Language } from 'types';

export default async function (interaction: CommandInteraction, language: Language) {
	if (!interaction.guild) return;
	const url = interaction.options.getString('url', true);
	const name = interaction.options.getString('name', true);
	if (name.length < 2 || name.length > 32) return handleCommandError(interaction, 'command.emoji.length');

	const newEmoji = await interaction.guild.emojis.create(url, name).catch(logger.error);
	if (!newEmoji) return handleCommandError(interaction, 'general.error');

	const description = t('command.emoji.add', language, { emojiName: name });

	const embed = new MessageEmbed().setColor(palette.success).setDescription(description);

	return interaction
		.reply({
			embeds: [embed],
		})
		.catch(logger.error);
}
