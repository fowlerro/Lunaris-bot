import { Permissions } from 'discord.js';
import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';

import type { Command } from '@typings/command';

export default {
	type: ApplicationCommandTypes.CHAT_INPUT,
	name: {
		en: 'emoji',
	},
	description: {
		en: 'Manage emojis',
		pl: 'Zarządzaj emotkami',
	},
	dm: false,
	permissions: Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS,
	options: [
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'add',
				pl: 'dodaj',
			},
			description: {
				en: 'Add emoji to server',
				pl: 'Dodaj emotkę na serwer',
			},
			required: false,
			options: [
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'url',
					},
					description: {
						en: "Emoji's URL",
						pl: 'Link URL emotki',
					},
					required: true,
				},
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'name',
						pl: 'nazwa',
					},
					description: {
						en: "Emoji's name",
						pl: 'Nazwa emotki',
					},
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'delete',
				pl: 'usuń',
			},
			description: {
				en: 'Delete emoji from server',
				pl: 'Usuń emotkę z serwera',
			},
			required: false,
			options: [
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'emoji',
					},
					description: {
						en: 'Emoji to delete',
						pl: 'Emotka którą chcesz usunąć',
					},
					required: true,
					autocomplete: true,
				},
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'reason',
						pl: 'powód',
					},
					description: {
						en: 'Reason',
						pl: 'Powód',
					},
				},
			],
		},
	],
	run: async interaction => {},
} as Command;
