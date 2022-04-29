import { AutocompleteInteraction, CommandInteraction, Permissions } from 'discord.js';

import BaseCommand from '@utils/structures/BaseCommand';
import { handleCommandError } from '@commands/errors';

import create from './create';

export default class ReactionRolesCommand extends BaseCommand {
	constructor() {
		super(
			'roles',
			'CHAT_INPUT',
			{
				en: 'Manage Interactive Roles',
				pl: 'Zarządzanie Rolami Interaktywnymi',
			},
			[
				{
					name: 'create',
					description: 'Create a new Interactive Roles',
					type: 'SUB_COMMAND_GROUP',
				},
			],
			false,
			true
		);
	}

	async run(interaction: CommandInteraction) {
		if (!interaction.guildId || !interaction.guild || !interaction.member) return;
		if (!('id' in interaction.member)) return;
		if (!interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES))
			return handleCommandError(interaction, 'command.executorWithoutPermission');

		const subcommandGroup = interaction.options.getSubcommandGroup();
		const subcommand = interaction.options.getSubcommand(true);

		if (subcommandGroup === 'create') return create(interaction);
	}
}
