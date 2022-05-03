import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';

import type { Command } from '@typings/command';
import { supportedColorFormats } from '@utils/utils';

export default {
	type: ApplicationCommandTypes.CHAT_INPUT,
	name: {
		en: 'color',
		pl: 'kolor',
	},
	description: {
		en: 'Convert or display colors',
		pl: 'Konwertuj oraz wyświetlaj kolory',
	},
	dm: true,
	permissions: undefined,
	options: [
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'convert',
				pl: 'konwertuj',
			},
			description: {
				en: 'Convert colors',
				pl: 'Konwertuj kolory',
			},
			options: [
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'input-format',
					},
					description: {
						en: 'Color format, you wanna convert from',
						pl: 'Format koloru, który chcesz przekonwertować',
					},
					required: true,
					choices: supportedColorFormats.map(format => ({
						name: {
							en: format,
						},
						value: format,
					})),
				},
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'output-format',
					},
					description: {
						en: 'Color format, you wanna get',
						pl: 'Format koloru, który chcesz otrzymać',
					},
					required: true,
					choices: supportedColorFormats.map(format => ({
						name: {
							en: format,
						},
						value: format,
					})),
				},
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'color',
						pl: 'kolor',
					},
					description: {
						en: 'Color to convert',
						pl: 'Kolor do przekonwertowania',
					},
					required: true,
				},
			],
		},
		{
			type: ApplicationCommandOptionTypes.SUB_COMMAND,
			name: {
				en: 'display',
				pl: 'wyświetl',
			},
			description: {
				en: 'Display color',
				pl: 'Wyświetl kolor',
			},
			options: [
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'color',
						pl: 'kolor',
					},
					description: {
						en: 'Color to display',
						pl: 'Kolor do wyświetlenia',
					},
					required: true,
				},
				{
					type: ApplicationCommandOptionTypes.STRING,
					name: {
						en: 'input-format',
					},
					description: {
						en: 'Color format',
						pl: 'Format koloru',
					},
					choices: supportedColorFormats.map(format => ({
						name: {
							en: format,
						},
						value: format,
					})),
				},
			],
		},
	],
	run: async interaction => {},
} as Command;
