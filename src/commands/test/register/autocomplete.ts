import { AutocompleteInteraction } from 'discord.js';

export default async function (interaction: AutocompleteInteraction) {
	if (!interaction.guildId || !interaction.guild) return;

	const input = interaction.options.getString('command_name', true);

	const options = client.commands
		.filter(command => command.name.en.includes(input) || command.name.pl?.includes(input) || false)
		.map(command => ({
			name: command.name.en,
			name_localizations: {
				'en-US': command.name.en,
				pl: command.name.pl,
			},
			value: command.name.en,
		}));

	return interaction.respond(options.splice(0, 25)).catch(logger.error);
}
