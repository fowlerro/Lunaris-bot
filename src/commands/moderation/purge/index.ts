import { ApplicationCommandOptionTypes, ApplicationCommandTypes, ChannelTypes } from 'discord.js/typings/enums';

import type { Command } from '@typings/command';
import { MessageEmbed, Permissions, TextChannel } from 'discord.js';
import { handleCommandError } from '@commands/errors';
import { palette } from '@utils/utils';

export default {
	type: ApplicationCommandTypes.CHAT_INPUT,
	name: {
		en: 'purge',
		pl: 'wyczyść',
	},
	description: {
		en: 'Delete many messages at once',
		pl: 'Wyczyść wiele wiadomości na raz',
	},
	dm: false,
	permissions: Permissions.FLAGS.MANAGE_MESSAGES,
	options: [
		{
			type: ApplicationCommandOptionTypes.INTEGER,
			name: {
				en: 'count',
				pl: 'liczba',
			},
			description: {
				en: 'Message count to purge',
				pl: 'Liczba wiadomości do wyczyszczenia',
			},
			required: true,
			minValue: 1,
			maxValue: 100,
		},
		{
			type: ApplicationCommandOptionTypes.USER,
			name: {
				en: 'user',
				pl: 'użytkownik',
			},
			description: {
				en: 'A user, whose messages will be purged',
				pl: 'Użytkownik, którego wiadomości zostaną wyczyszczone',
			},
		},
		{
			type: ApplicationCommandOptionTypes.CHANNEL,
			name: {
				en: 'channel',
				pl: 'kanał',
			},
			description: {
				en: 'Text channel in which messages will be purged',
				pl: 'Kanał tekstowy, w którym wiadomości zostaną wyczyszczone',
			},
			channelTypes: [ChannelTypes.GUILD_TEXT],
		},
	],
	run: async (interaction, language) => {
		if (!interaction.member) return;
		if (!('id' in interaction.member)) return;
		if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES))
			return handleCommandError(interaction, 'command.executorWithoutPermission');
		let count = interaction.options.getInteger('count', true);
		const user = interaction.options.getUser('user');
		const channel = (interaction.options.getChannel('channel') as TextChannel) || (interaction.channel! as TextChannel);

		if (count > 100) count = 100;
		if (count < 1) count = 1;

		let fetched = await channel.messages.fetch({ limit: user ? 100 : count }, { cache: false }).catch(logger.error);
		if (!fetched) return handleCommandError(interaction, 'general.error');
		if (user) {
			let filterCount = 0;
			fetched = fetched
				.filter(message => message.author.id === user.id)
				.filter(() => {
					filterCount++;
					return filterCount <= count;
				});
		}
		const deletedMessages = await channel.bulkDelete(fetched, true).catch(logger.error); // TODO Returning inproper messages collection
		if (!deletedMessages) return handleCommandError(interaction, 'general.error');

		const descriptionType =
			user && interaction.options.getChannel('channel')
				? 'user-channel'
				: user
				? 'user'
				: interaction.options.getChannel('channel')
				? 'channel'
				: 'default';

		const embed = new MessageEmbed().setColor(palette.success).setDescription(
			t(`command.purge.success.${descriptionType}`, language, {
				deletedCount: deletedMessages.size.toString() || '1',
				userId: user?.id || '',
				channelId: channel.id,
			})
		);

		return interaction
			.reply({
				embeds: [embed],
			})
			.catch(logger.error);
	},
} as Command;
