import { CommandInteraction, Formatters, MessageEmbed } from 'discord.js';

import Mod from '@modules/Mod';
import Embeds from '@modules/Embeds';
import { handleCommandError } from '@commands/errors';
import { palette } from '@utils/utils';

import type { Language } from 'types';

export default async function (interaction: CommandInteraction, language: Language) {
	if (!interaction.guildId) return;
	const user = interaction.options.getUser('member');
	const page = interaction.options.getInteger('page') || 1;

	const result = await Mod.warn.list(interaction.guildId, user?.id || undefined);
	if (result.error) return handleCommandError(interaction, 'general.error');
	let embedFields: any[] = [];

	if (result.warns.length) {
		embedFields = (
			await Promise.all(
				result.warns.map(async profile => {
					if ('warns' in profile)
						return Promise.all(
							profile.warns.map(async warn => {
								let executor = warn.executorId;
								if (!isNaN(+executor)) {
									const executorUser = await client.users.fetch(executor).catch(logger.error);
									if (!executorUser) return;
									executor = executorUser.tag;
								}

								const user = await client.users.fetch(profile.userId).catch(logger.error);
								if (!user) return;
								const userNick = user.tag;

								return {
									name: `Nick: ${userNick}`,
									value: `**Mod**: ${executor}
                    **${t('general.reason', language)}**: ${warn.reason}
                    **${t('general.date', language)}**: ${Formatters.time(new Date(warn.date))}`,
									inline: true,
								};
							})
						);

					let executor = profile.executorId;
					if (!isNaN(+executor)) {
						const executorUser = await client.users.fetch(executor).catch(logger.error);
						if (!executorUser) return;
						executor = executorUser.tag;
					}

					return {
						name: `Mod: ${executor}`,
						value: `**${t('general.reason', language)}**: ${profile.reason}
              **${t('general.date', language)}**: ${Formatters.time(new Date(profile.date))}`,
						inline: true,
					};
				})
			)
		).flat();
	}

	const embedAuthor = user
		? t('command.warn.list', language, { userTag: user.tag })
		: t('command.warn.guildList', language);

	const embed = new MessageEmbed()
		.setColor(palette.info)
		.setAuthor({ name: embedAuthor, iconURL: interaction.guild?.iconURL() || undefined })
		.setTimestamp();

	if (!embedFields.length) embed.setDescription(t('general.none', language));
	if (embedFields.length) embed.addFields(embedFields);

	const embeds = Embeds.checkLimits(embed, true, 9);
	if (embeds.error) return handleCommandError(interaction, 'general.error');

	Embeds.pageInteractionEmbeds(null, embeds.pages, interaction, page, true);
}
