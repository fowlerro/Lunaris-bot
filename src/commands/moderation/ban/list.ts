import { CommandInteraction, EmbedFieldData, Formatters, MessageEmbed } from 'discord.js';

import Embeds from '@modules/Embeds';
import { handleCommandError } from '@commands/errors';
import { palette } from '@utils/utils';

import type { Language } from 'types';

export default async function (interaction: CommandInteraction, language: Language) {
	if (!interaction.guildId) return;

	const page = interaction.options.getInteger('page') || 1;

	const bans = await interaction.guild?.bans.fetch().catch(logger.error);
	if (!bans) return handleCommandError(interaction, 'general.error');

	const fields: EmbedFieldData[] = bans.map(ban => ({
		name: ban.user.tag,
		value: `**ID:** \`${ban.user.id}\`\n**${t('general.reason', language)}:** ${Formatters.codeBlock(
			ban.reason || t('general.none', language)
		)}`,
		inline: true,
	}));

	const embed = new MessageEmbed().setColor(palette.info).setTitle(t('command.ban.list', language)).setTimestamp();

	if (fields.length) embed.addFields(fields);
	if (!fields.length) embed.setDescription(t('general.none', language));

	const checkedEmbed = Embeds.checkLimits(embed, true);
	if (checkedEmbed.error) return handleCommandError(interaction, 'general.error');

	Embeds.pageInteractionEmbeds(null, checkedEmbed.pages, interaction, page, true);
}
