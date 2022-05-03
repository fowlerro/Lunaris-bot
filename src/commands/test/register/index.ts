import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';

import type { Command } from '@typings/command';
import CommandHandler from '@modules/CommandHandler';

export default {
	type: ApplicationCommandTypes.CHAT_INPUT,
	name: {
		en: 'register',
	},
	description: {
		en: 'Register a command',
		pl: 'Rejestruje komendę',
	},
	dm: false,
	permissions: undefined,
	options: [
		{
			type: ApplicationCommandOptionTypes.STRING,
			name: {
				en: 'command_name',
				pl: 'nazwa_komendy',
			},
			description: {
				en: 'Name of command to register',
				pl: 'Nazwa komendy do zarejestrowania',
			},
			required: true,
			autocomplete: true,
		},
	],
	test: true,
	owner: true,
	run: async (interaction, ...args) => {
		const commandName = interaction.options.getString('command_name', true);
		await CommandHandler.register(commandName);

		return interaction.reply({ content: 'ok' });
	},
} as Command;
