import { CommandInteraction, MessageEmbed } from 'discord.js';

import { handleCommandError } from '@commands/errors';
import { colorFormatsType, convertColor, supportedColorFormats } from '@utils/utils';

import type { Language } from 'types';

export default async function (interaction: CommandInteraction, language: Language) {
	const inputFormat = interaction.options.getString('input-format', true) as colorFormatsType;
	if (!supportedColorFormats.includes(inputFormat))
		return handleCommandError(interaction, 'command.color.incorrectFormat');

	const outputFormat = interaction.options.getString('output-format', true) as colorFormatsType;
	if (!supportedColorFormats.includes(outputFormat))
		return handleCommandError(interaction, 'command.color.incorrectFormat');
	const color = interaction.options.getString('color', true);

	const convertedColor = convertColor(inputFormat, outputFormat, color);
	if (convertedColor instanceof Error) return handleCommandError(interaction, 'command.color.invalidColor');

	const hexColor = convertColor(inputFormat, 'HEX', color) as `#${string}`;

	const embed = new MessageEmbed().setColor(hexColor).setDescription(
		t('command.color.converted', language, {
			inputFormat,
			inputColor: color,
			outputFormat,
			outputColor: convertedColor.toString(),
		})
	);

	return interaction
		.reply({
			embeds: [embed],
		})
		.catch(logger.error);
}
