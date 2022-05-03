import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';

import type { Command } from '@typings/command';
import { Permissions } from 'discord.js';

export default {
	type: ApplicationCommandTypes.CHAT_INPUT,
	name: {
		en: 'level',
		pl: 'poziom',
	},
	description: {
		en: 'Manage Level module',
		pl: 'Zarządzaj modułem poziomów',
	},
	dm: false,
	permissions: Permissions.FLAGS.MANAGE_GUILD,
	options: [
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'multiplier',
				pl: 'mnożnik',
			},
			description: {
				en: 'Set level multiplier',
				pl: 'Ustaw mnożnik poziomów',
			},
			options: [
				{
					type: ApplicationCommandOptionTypes.NUMBER,
					name: {
						en: 'value',
						pl: 'wartość',
					},
					description: {
						en: 'Default is 1 (20-35xp per message)',
						pl: 'Domyślnie 1 (20-35xp za wiadomość)',
					},
					minValue: 0.01,
					maxValue: 5,
				},
			],
		},
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'message',
				pl: 'wiadomość',
			},
			description: {
				en: 'Manage Level UP Message',
				pl: 'Zarządzaj wiadomością awansu',
			},
			options: [
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'custom-message',
						pl: 'własna-wiadomość',
					},
					description: {
						en: 'Custom message for ',
						pl: 'Domyślnie 1 (20-35xp za wiadomość)',
					},
					minValue: 0.01,
					maxValue: 5,
				},
			],
		},
	],
	test: true,
	run: async (interaction, language) => {
		return interaction.reply({ content: 'ok' });
	},
} as Command;
