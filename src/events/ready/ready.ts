import BaseEvent from '../../utils/structures/BaseEvent';
import { registerModules, registerPresence } from '../../utils/registry';
import { testGuildId } from '@utils/utils';

export default class ReadyEvent extends BaseEvent {
	constructor() {
		super('ready');
	}

	async run() {
		logger.info(client.user?.tag + ' has logged in.');
		await registerPresence();
		await registerModules('../modules');
		client.isOnline = true;

		// const guild = await client.guilds.fetch(testGuildId);
		// const commands = await guild.commands.fetch();
		// commands?.forEach(command => {
		// 	command.delete();
		// });
	}
}
