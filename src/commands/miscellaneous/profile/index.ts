import { ApplicationCommandOptionTypes, ApplicationCommandTypes } from 'discord.js/typings/enums';

import type { Command } from '@typings/command';
import Profiles from '@modules/Profiles';
import { handleCommandError } from '@commands/errors';

export default {
	type: ApplicationCommandTypes.CHAT_INPUT,
	name: {
		en: 'profile',
		pl: 'profil',
	},
	description: {
		en: "Display user's profile",
		pl: 'Wyświetl profil użytkownika',
	},
	dm: true,
	permissions: undefined,
	options: [
		{
			type: ApplicationCommandOptionTypes.USER,
			name: {
				en: 'user',
				pl: 'użytkownik',
			},
			description: {
				en: "Display specified user's profile",
				pl: 'Wyświetl profil podanego użytkownika',
			},
		},
		{
			type: ApplicationCommandOptionTypes.BOOLEAN,
			name: {
				en: 'global',
			},
			description: {
				en: 'Select this option to display global profile',
				pl: 'Wybierz tę opcję aby wyświetlić globalny profil',
			},
		},
	],
	run: async interaction => {
		if (!interaction.guildId) return;

		const member = interaction.options.getMember('user') || interaction.member;
		if (!member || !('id' in member) || member.user.bot) return handleCommandError(interaction, 'general.error');
		const isGlobal = interaction.options.getBoolean('global') || false;

		const profile = await Profiles.get(member.id, interaction.guildId);
		if (!profile) return handleCommandError(interaction, 'general.error');
		const globalProfile = await Profiles.get(member.id);
		if (!globalProfile) return handleCommandError(interaction, 'general.error');

		const profileCardBuffer = await Profiles.generateCard(
			member,
			profile,
			globalProfile,
			member.user.displayAvatarURL({ format: 'png' }),
			isGlobal
		);

		return interaction
			.reply({
				files: [profileCardBuffer],
			})
			.catch(logger.error);
	},
} as Command;
