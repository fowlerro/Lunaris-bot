import { CommandInteraction, MessageActionRow, MessageButton, MessageSelectMenu } from 'discord.js';

import BaseCommand from '@utils/structures/BaseCommand';
import InteractiveRoles from '@modules/InteractiveRoles';

import type { InteractiveRoleItem } from 'types';

export default class TestCommand extends BaseCommand {
	constructor() {
		super(
			'test',
			'CHAT_INPUT',
			{
				en: 'Testing command',
				pl: 'Komenda testowa',
			},
			[
				{
					name: 'log',
					description: 'action',
					type: 'STRING',
					required: true,
				},
			],
			true,
			true
		);
	}

	async run(interaction: CommandInteraction) {
		if (!interaction.guildId) return;
		if (!interaction.member || !('guild' in interaction.member)) return;

		const roles: InteractiveRoleItem[] = [
			{ label: 'Add', icon: '💩', roleId: '844234056996487198', description: 'Role <@844234056996487198>' },
			{
				label: 'Remove',
				description: 'Role <@844233717337423941>',
				icon: '<:peepoRR:841055768915738675>',
				roleId: '844233717337423941',
			},
			{
				label: 'Toggle',
				icon: '<:PeepoThink:821497966153039904>',
				description: 'Role <@861596116821737532>',
				roleId: '861596116821737532',
			},
		];

		// InteractiveRoles.create({
		// 	name: 'Test',
		// 	guildId: interaction.guildId,
		// 	channelId: '930968325847134228',
		// 	messageId: '964501969433673758',
		// 	type: 'select',
		// 	placeholder: 'Select roles',
		// 	roles,
		// }).catch(logger.error);

		try {
			const msg = await interaction.channel?.send({ content: 'chuj' });
			msg?.react('821497966153039904').catch(logger.error);
			msg?.react('PepeGood:821498020851875920').catch(logger.error);

			const button = new MessageButton().setEmoji('821497966153039904').setStyle('PRIMARY').setCustomId('test2');
			const button2 = new MessageButton()
				.setEmoji('PepeGood:821498020851875920')
				.setStyle('SUCCESS')
				.setCustomId('test3');

			const buttons = new MessageActionRow().addComponents([button, button2]);

			await msg?.edit({ components: [buttons] }).catch(logger.error);

			const selectMenu = new MessageSelectMenu()
				.setOptions([
					{
						emoji: '821497966153039904',
						label: 'Test',
						value: 'test',
					},
					{
						emoji: 'PepeGood:821498020851875920',
						label: 'Test2',
						value: 'test2',
					},
				])
				.setCustomId('test');
			const menuRow = new MessageActionRow().addComponents([selectMenu]);

			await msg?.edit({ components: [buttons, menuRow] }).catch(logger.error);
		} catch (err) {
			logger.error(err);
		}

		interaction
			.reply({
				content: 'ok',
				ephemeral: true,
			})
			.catch(logger.error);
	}
}
