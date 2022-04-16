import { CommandInteraction } from 'discord.js';

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

		InteractiveRoles.create({
			guildId: interaction.guildId,
			channelId: '930968325847134228',
			messageId: '964501969433673758',
			type: 'select',
			placeholder: 'Select roles',
			roles,
		}).catch(logger.error);

		interaction
			.reply({
				content: 'ok',
				ephemeral: true,
			})
			.catch(logger.error);
	}
}
