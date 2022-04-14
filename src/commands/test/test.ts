import reactionRoles from '@modules/reactionRoles';
import { ReactionRoleItem } from '@schemas/ReactionRoles';
import { CommandInteraction } from 'discord.js';

import BaseCommand from '../../utils/structures/BaseCommand';

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

		const reactions: ReactionRoleItem[] = [
			{ label: '💩', roleId: '844234056996487198', action: 'add' },
			{ label: '<:peepoRR:841055768915738675>', roleId: '844233717337423941', action: 'remove' },
			{ label: '<:PeepoThink:821497966153039904>', roleId: '861596116821737532', action: 'toggle' },
		];

		reactionRoles.create(interaction.guildId, '533385774352302091', '964245551757557760', 'reactions', reactions);

		interaction.reply({
			content: 'ok',
			ephemeral: true,
		});
	}
}
