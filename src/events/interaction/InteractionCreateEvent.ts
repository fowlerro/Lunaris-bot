// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildBanRemove
import { Interaction } from 'discord.js';

import BaseEvent from '@utils/structures/BaseEvent';
import CommandHandler from '@modules/CommandHandler';
import Logs from '@modules/Logs';
import InteractiveRoles from '@modules/InteractiveRoles';

export default class InteractionCreateEvent extends BaseEvent {
	constructor() {
		super('interactionCreate');
	}

	async run(interaction: Interaction) {
		if (!client.isOnline) return;

		try {
			if (interaction.isCommand() || interaction.isContextMenu()) CommandHandler.handle(interaction);

			if (interaction.isAutocomplete()) CommandHandler.autocomplete(interaction);

			if (interaction.isButton()) {
				Logs.handleAction(interaction);
				InteractiveRoles.handleButtons(interaction);
			}

			if (interaction.isSelectMenu()) {
				InteractiveRoles.handleSelect(interaction);
			}
		} catch (e) {
			logger.error(e);
		}
	}
}
