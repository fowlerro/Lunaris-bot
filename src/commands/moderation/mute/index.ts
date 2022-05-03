import { Permissions } from 'discord.js';
import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';

import type { Command } from '@typings/command';

export default {
	type: ApplicationCommandTypes.CHAT_INPUT,
	name: {
		en: 'mute',
	},
	description: {
		en: 'Manage mutes',
		pl: 'Zarządzaj wyciszeniami',
	},
	dm: false,
	permissions: Permissions.FLAGS.MODERATE_MEMBERS,
	options: [
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'give',
				pl: 'przyznaj',
			},
			description: {
				en: 'Mute a user',
				pl: 'Wycisz użytkownika',
			},
			options: [
				{
					type: ApplicationCommandOptionTypes.USER,
					name: {
						en: 'member',
						pl: 'użytkownik',
					},
					description: {
						en: 'Member to mute',
						pl: 'Użytkownik do wyciszenia',
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
						en: 'Time for a mute, e.g. 1d 5h 30m 30s',
						pl: 'Czas wyciszenia, np. 1d 5h 30m 30s',
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
						en: 'Reason for a mute',
						pl: 'Powód wyciszenia',
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
				en: 'Remove a mute',
				pl: 'Usuń wyciszenie',
			},
			options: [
				{
					type: ApplicationCommandOptionTypes.USER,
					name: {
						en: 'member',
						pl: 'użytkownik',
					},
					description: {
						en: 'Member to be unmuted',
						pl: 'Użytkownik do odblokowania',
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
						en: 'Reason for an unmute',
						pl: 'Powód odblokowania',
					},
				},
			],
		},
	],
	run: async (interaction, language) => {},
} as Command;
