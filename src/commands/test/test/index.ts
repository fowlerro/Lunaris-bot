import { ApplicationCommandTypes } from 'discord.js/typings/enums';

import type { Command } from 'src/typings/command';

export default {
	type: ApplicationCommandTypes.CHAT_INPUT,
	name: {
		en: 'test',
	},
	description: {
		en: 'Test command',
		pl: 'Komenda testowa',
	},
	dm: false,
	permissions: undefined,
	options: [],
	test: true,
	run: async (interaction, language) => {
		return interaction.reply({ content: 'ok' });
	},
} as Command;
