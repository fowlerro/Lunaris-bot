import { CommandInteraction, MessageAttachment, MessageEmbed } from 'discord.js';
import { createCanvas } from 'canvas';

import { handleCommandError } from '@commands/errors';
import { colorFormatsType, convertColor, matchColorFormat } from '@utils/utils';
import type { Language } from 'types';

export default async function (interaction: CommandInteraction, language: Language) {
	const color = interaction.options.getString('color', true);
	const inputFormat = (interaction.options.getString('input-format') as colorFormatsType) ?? matchColorFormat(color);
	if (!inputFormat) return handleCommandError(interaction, 'command.color.invalidColor');

	const hexColor = convertColor(inputFormat, 'HEX', color) as `#${string}` | Error;
	if (hexColor instanceof Error) return handleCommandError(interaction, 'command.color.invalidColor');
	const rgbColor = convertColor(inputFormat, 'RGB', color);
	const hsvColor = convertColor(inputFormat, 'HSV', color);
	const hslColor = convertColor(inputFormat, 'HSL', color);
	const cmykColor = convertColor(inputFormat, 'CMYK', color);

	const canvas = createCanvas(50, 50);
	const ctx = canvas.getContext('2d');
	ctx.fillStyle = hexColor;
	ctx.fillRect(0, 0, 50, 50);
	const attachment = new MessageAttachment(canvas.toBuffer('image/jpeg'), 'color.jpg');

	const description = `**RGB:** \`${rgbColor}\`
                **HEX:** \`${hexColor}\`
                **HSV:** \`${hsvColor}\`
                **HSL:** \`${hslColor}\`
                **CMYK:** \`${cmykColor}\``;

	const embed = new MessageEmbed().setColor(hexColor).setDescription(description).setImage('attachment://color.jpg');

	return interaction
		.reply({
			files: [attachment],
			embeds: [embed],
		})
		.catch(logger.error);
}
