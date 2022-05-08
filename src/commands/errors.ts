import { CommandInteraction, ContextMenuInteraction, MessageEmbed } from 'discord.js';
import type { Replacements } from 'i18n';

import { getLocale, IPalette, palette } from '../utils/utils';
import type { LocalePhrase } from '../typings/locales';

export async function handleCommandError(
	interaction: CommandInteraction | ContextMenuInteraction,
	description: LocalePhrase,
	color: keyof IPalette = 'error',
	ephemeral: boolean = true,
	vars?: Replacements
) {
	const language = getLocale(interaction.guildLocale);

	const embed = new MessageEmbed().setColor(palette[color]).setDescription(t(description, language, vars));

	return interaction
		.reply({
			embeds: [embed],
			ephemeral,
		})
		.catch(logger.error);
}
