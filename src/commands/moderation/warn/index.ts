import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';

import type { Command } from '@typings/command';
import { Permissions } from 'discord.js';

export default {
	type: ApplicationCommandTypes.CHAT_INPUT,
	name: {
		en: 'warn',
	},
	description: {
		en: 'Manage warns',
		pl: 'Zarządzaj ostrzeżeniami',
	},
	dm: false,
	permissions: Permissions.FLAGS.MANAGE_ROLES,
	options: [
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'give',
				pl: 'przyznaj',
			},
			description: {
				en: 'Warn a user',
				pl: 'Ostrzeż użytkownika',
			},
			options: [
				{
					type: ApplicationCommandOptionTypes.USER,
					name: {
						en: 'member',
						pl: 'użytkownik',
					},
					description: {
						en: 'Member to warn',
						pl: 'Użytkownik do ostrzeżenia',
					},
					required: true,
				},
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'reason',
						pl: 'powód',
					},
					description: {
						en: 'Reason for a warn',
						pl: 'Powód ostrzeżenia',
					},
				},
			],
		},
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'remove',
				pl: 'usuń',
			},
			description: {
				en: 'Remove a warn',
				pl: 'Usuń ostrzeżenie',
			},
			options: [
				{
					type: ApplicationCommandOptionTypes.USER,
					name: {
						en: 'member',
						pl: 'użytkownik',
					},
					description: {
						en: 'Member whose warn will be removed',
						pl: 'Użytkownik, którego ostrzeżenie zostanie usunięte',
					},
					required: true,
				},
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'warn',
						pl: 'ostrzeżenie',
					},
					description: {
						en: 'Warn to remove',
						pl: 'Ostrzeżenie do usunięcia',
					},
					required: true,
					autocomplete: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'remove-all',
				pl: 'usuń-wszystkie',
			},
			description: {
				en: 'Remove all warns from this server',
				pl: 'Usuń wszystkie ostrzeżenia z serwera',
			},
		},
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'list',
				pl: 'lista',
			},
			description: {
				en: 'Show warn list',
				pl: 'Wyświetl listę ostrzeżeń',
			},
			options: [
				{
					type: ApplicationCommandOptionTypes.USER,
					name: {
						en: 'member',
						pl: 'użytkownik',
					},
					description: {
						en: 'Member whose warns will be shown',
						pl: 'Użytkownik, którego ostrzeżenia zostaną wyświetlone',
					},
				},
				{
					type: ApplicationCommandOptionTypes.INTEGER,
					name: {
						en: 'page',
						pl: 'strona',
					},
					description: {
						en: "List's page to show",
						pl: 'Strona listy do wyświetlenia',
					},
					minValue: 1,
				},
			],
		},
	],
	run: async (interaction, language) => {},
} as Command;
