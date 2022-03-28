import { CommandInteraction, EmbedFieldData, MessageEmbed } from 'discord.js';

import Logs from '../../../modules/Logs';
import templates from '../../../modules/Logs/templates';
import { getLocale, palette } from '../../../utils/utils';
import { handleCommandError } from '../../errors';

import type { LocalePhrase } from '../../../types/locales';
import type { GuildLogTypes } from 'types';

export default async (interaction: CommandInteraction) => {
	const language = getLocale(interaction.guildLocale);
	const category = interaction.options.getString('category') as keyof GuildLogTypes;
	if (category && !Object.keys(templates).includes(category))
		return handleCommandError(interaction, 'command.logs.wrongCategory');

	const config = await Logs.get(interaction.guildId!);
	if (!config) return handleCommandError(interaction, 'general.error');

	const enabledMessage = '🟢';
	const disabledMessage = '🔴';

	const fields: EmbedFieldData[] = category
		? [
				{
					name: t(`command.logs.categories.${category}` as LocalePhrase, language),
					value:
						`**${t(`general.channel`, language)}:** ${
							config?.logs?.[category]?.channelId
								? `<#${config?.logs?.[category]?.channelId}>`
								: t('general.none', language)
						}\n` +
						Object.keys(templates[category])
							.map(
								key =>
									`${
										// @ts-ignore
										config?.logs?.[category]?.logs?.[key] ? enabledMessage : disabledMessage
									} ${key}`
							)
							.join('\n'),
				},
		  ]
		: Object.keys(templates).map(cat => ({
				name: t(`command.logs.categories.${cat}` as LocalePhrase, language),
				value:
					`**${t(`general.channel`, language)}:** ${
						config?.logs?.[cat as keyof GuildLogTypes]?.channelId
							? `<#${config?.logs?.[cat as keyof GuildLogTypes]?.channelId}>`
							: t('general.none', language)
					}\n` +
					Object.keys(templates[cat as keyof GuildLogTypes])
						.map(
							key =>
								`${
									// @ts-ignore
									config?.logs?.[cat]?.logs?.[key] ? enabledMessage : disabledMessage
								} ${key}`
						)
						.join('\n'),
				inline: true,
		  }));

	if (!fields.length) return handleCommandError(interaction, 'general.error');
	if (!category) fields.push({ name: '\u200b', value: '\u200b', inline: true });

	const embed = new MessageEmbed()
		.setColor(palette.success)
		.setTitle(t('command.logs.status', language))
		.addFields(fields);

	return interaction
		.reply({
			embeds: [embed],
		})
		.catch(logger.error);
};
