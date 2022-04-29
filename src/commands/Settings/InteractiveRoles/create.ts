import {
	CommandInteraction,
	MessageEmbedOptions,
	MessageActionRow,
	MessageButton,
	Message,
	ButtonInteraction,
} from 'discord.js';

import { getLocale, palette } from '@utils/utils';

export default async (interaction: CommandInteraction) => {
	interaction.deferReply({ ephemeral: true });
	const language = getLocale(interaction.guildLocale);

	let page = 0;

	const canceledEmbed: MessageEmbedOptions = {
		color: palette.info,
		title: t('command.roles.create.canceled', language),
	};

	const embeds: MessageEmbedOptions[] = [
		{
			color: palette.info,
			title: t('command.roles.create.begin', language),
		},
		{
			color: palette.info,
			title: t('command.roles.create.message', language),
		},
		{
			color: palette.info,
			title: t('command.roles.create.roles', language),
		},
		{
			color: palette.success,
			title: t('command.roles.create.finish', language),
		},
	];

	const navigationButtons: MessageButton[] = [
		new MessageButton({
			customId: 'interactiveRoleCreatorCancel',
			// label: 'Cancel',
			emoji: '❌',
			style: 'DANGER',
		}),
		new MessageButton({
			customId: 'interactiveRoleCreatorPrevious',
			emoji: '⬅',
			style: 'PRIMARY',
			disabled: true,
		}),
		new MessageButton({
			customId: 'interactiveRoleCreatorNext',
			emoji: '➡',
			style: 'PRIMARY',
		}),
	];

	const navigationRow = new MessageActionRow({ components: navigationButtons });

	const components = [navigationRow];

	await interaction
		.reply({
			embeds: [embeds[0]],
			components,
			ephemeral: true,
		})
		.catch(logger.error);

	const reply = await interaction.fetchReply();

	if (!(reply instanceof Message)) return;

	const navigationCollector = reply.createMessageComponentCollector({
		componentType: 'BUTTON',
		filter: (button: ButtonInteraction) =>
			button.customId === 'interactiveRoleCreatorPrevious' ||
			button.customId === 'interactiveRoleCreatorNext' ||
			button.customId === 'interactiveRoleCreatorCancel',

		time: 5 * 60 * 1000,
	});

	navigationCollector.on('collect', (button: ButtonInteraction) => {
		if (button.customId === 'interactiveRoleCreatorCancel') {
			navigationCollector.stop();
			interaction.editReply({
				embeds: [canceledEmbed],
				components: [],
			});
		}

		if (button.customId === 'interactiveRoleCreatorNext') {
			page += 1;
			navigationButtons[1].disabled = false;
			if (page === embeds.length - 1) {
				navigationButtons[2].disabled = true;
			}

			interaction.editReply({
				embeds: [embeds[page]],
				components: [new MessageActionRow({ components: navigationButtons })],
			});
		}

		if (button.customId === 'interactiveRoleCreatorPrevious') {
			page -= 1;
			navigationButtons[2].disabled = false;
			if (page === 0) {
				navigationButtons[1].disabled = true;
			}

			interaction.editReply({
				embeds: [embeds[page]],
				components: [new MessageActionRow({ components: navigationButtons })],
			});
		}
	});
};
