import { Command } from 'src/typings/command';
import { MessageEmbed } from 'discord.js';
import { ApplicationCommandTypes } from 'discord.js/typings/enums';

export default {
	type: ApplicationCommandTypes.USER,
	name: {
		en: 'Avatar',
	},
	dm: false,
	permissions: undefined,
	run: async interaction => {
		const targetMember = await interaction.guild?.members.fetch(interaction.targetId).catch(logger.error);
		if (!targetMember) return;
		const avatarURL = targetMember.user.displayAvatarURL({ size: 256, dynamic: true });

		const embed = new MessageEmbed().setColor(targetMember.displayColor).setImage(avatarURL);

		interaction
			.reply({
				embeds: [embed],
			})
			.catch(logger.error);
	},
} as Command;
