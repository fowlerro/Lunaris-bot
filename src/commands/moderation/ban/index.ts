import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';

import type { Command } from '@typings/command';
import { Permissions } from 'discord.js';

export default {
	type: ApplicationCommandTypes.CHAT_INPUT,
	name: {
		en: 'ban',
	},
	description: {
		en: 'Manage bans',
		pl: 'Zarządzaj banami',
	},
	dm: false,
	permissions: Permissions.FLAGS.BAN_MEMBERS,
	options: [
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'give',
				pl: 'przyznaj',
			},
			description: {
				en: 'Ban a user',
				pl: 'Zbanuj użytkownika',
			},
			options: [
				{
					type: ApplicationCommandOptionTypes.USER,
					name: {
						en: 'member',
						pl: 'użytkownik',
					},
					description: {
						en: 'Member to ban',
						pl: 'Użytkownik do zbanowania',
					},
					required: true,
				},
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'time',
						pl: 'czas',
					},
					description: {
						en: 'Time for a ban, e.g. 1d 5h 30m 30s',
						pl: 'Czas bana, np. 1d 5h 30m 30s',
					},
				},
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'reason',
						pl: 'powód',
					},
					description: {
						en: 'Reason for a ban',
						pl: 'Powód bana',
					},
				},
			],
		},
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'give-by-id',
			},
			description: {
				en: 'Ban a user by id',
				pl: 'Zbanuj użytkownika za pomocą id',
			},
			options: [
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'user-id',
					},
					description: {
						en: "Member's id to ban",
						pl: 'ID użytkownika do zbanowania',
					},
					required: true,
				},
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'time',
						pl: 'czas',
					},
					description: {
						en: 'Time for a ban, e.g. 1d 5h 30m 30s',
						pl: 'Czas bana, np. 1d 5h 30m 30s',
					},
				},
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'reason',
						pl: 'powód',
					},
					description: {
						en: 'Reason for a ban',
						pl: 'Powód bana',
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
				en: 'Remove a ban',
				pl: 'Usuń bana',
			},
			options: [
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'user-id',
					},
					description: {
						en: "User's id to unban",
						pl: 'ID użytkownika do odbanowania',
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
						en: 'Reason for an unban',
						pl: 'Powód odbanowania',
					},
				},
			],
		},
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'list',
				pl: 'lista',
			},
			description: {
				en: 'Show ban list',
				pl: 'Wyświetl listę banów',
			},
			options: [
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
