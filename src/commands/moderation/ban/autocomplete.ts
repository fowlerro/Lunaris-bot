import { AutocompleteInteraction } from 'discord.js';
import { Language } from 'types';

export default async function (interaction: AutocompleteInteraction, language: Language) {
	if (!interaction.guildId || !interaction.guild) return;
	const input = interaction.options.getString('user-id', true);
	const bans = await interaction.guild.bans.fetch().catch(logger.error);
	if (!bans) return interaction.respond([]).catch(logger.error);

	const options = bans
		.map(ban => ({
			name: `${ban.user.tag} (${ban.user.id})`,
			value: ban.user.id,
		}))
		.filter(option => option.name.includes(input));

	return interaction.respond(options?.splice(0, 25) || []).catch(logger.error);
}
