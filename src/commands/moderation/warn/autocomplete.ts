import { AutocompleteInteraction } from 'discord.js';

import Mod from '@modules/Mod';

import type { GuildProfileWarn, Language } from 'types';

export default async function (interaction: AutocompleteInteraction, language: Language) {
	if (!interaction.guildId || !interaction.guild) return;
	const memberId = interaction.options.get('member', true).value as string;
	const member = await interaction.guild.members.fetch(memberId).catch(logger.error);

	const input = interaction.options.getString('warn', true);
	if (!member || !('id' in member)) return;

	const { warns, error } = await Mod.warn.list(interaction.guildId, member.id);
	if (!warns.length || error) return;

	const options = (warns as GuildProfileWarn[])
		.filter(warn => warn.reason?.toLowerCase()?.includes(input.toLowerCase()) || false)
		.map(warn => ({
			name: `${warn.reason} | ${new Date(warn.date).toLocaleString()}`,
			value: warn._id.toString(),
		}));

	options.unshift({ name: t('command.warn.optionAll', language), value: 'targetAll' });

	return interaction.respond(options.splice(0, 25)).catch(logger.error);
}
