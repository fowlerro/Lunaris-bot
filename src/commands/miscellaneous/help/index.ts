import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';

import type { Command } from 'src/typings/command';

export default {
	type: ApplicationCommandTypes.CHAT_INPUT,
	name: {
		en: 'help',
		pl: 'pomoc',
	},
	description: {
		en: 'Informations about bot',
		pl: 'Informacje o bocie',
	},
	dm: true,
	permissions: undefined,
	options: [],
	run: async (interaction, language) => {
		const buttons = [
			new MessageButton()
				.setLabel(t('help.commands.title', language))
				.setURL('https://lunaris.pro/commands')
				.setStyle('LINK'),
			new MessageButton()
				.setLabel(t('help.dashboard.title', language))
				.setURL('https://lunaris.pro/dashboard')
				.setStyle('LINK'),
		];

		const row = new MessageActionRow().addComponents(buttons);

		return interaction.reply({
			content: t('help.support', language, { link: 'https://discord.gg/VVdGJWypGe' }),
			components: [row],
			ephemeral: true,
		});
	},
} as Command;
