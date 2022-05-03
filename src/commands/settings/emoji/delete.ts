import { CommandInteraction, MessageEmbed } from 'discord.js';

import { handleCommandError } from '@commands/errors';
import { palette } from '@utils/utils';

import type { Language } from 'types';

export default async function (interaction: CommandInteraction, language: Language) {
	if (!interaction.guild) return;

	const emojiId = interaction.options.getString('emoji', true);
	const reason = interaction.options.getString('reason') || undefined;

	const emoji = await interaction.guild.emojis.fetch(emojiId).catch(logger.error);
	if (!emoji || !emoji.deletable) return handleCommandError(interaction, 'command.emoji.notDeletable');

	const deletedEmoji = await emoji.delete(reason).catch(logger.error);
	if (!deletedEmoji) return handleCommandError(interaction, 'general.error');
	const description = t('command.emoji.delete', language, { emojiName: deletedEmoji.name || '' });

	const embed = new MessageEmbed().setColor(palette.success).setDescription(description);

	return interaction
		.reply({
			embeds: [embed],
		})
		.catch(logger.error);
}
