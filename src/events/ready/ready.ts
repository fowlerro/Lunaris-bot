import BaseEvent from "../../utils/structures/BaseEvent";
import { registerPresence } from "../../utils/registry";
import reactionRoles from "../../modules/reactionRoles";

export default class ReadyEvent extends BaseEvent {
	constructor() {
		super('ready');
	}

	async run() {
		console.log(client.user?.tag + ' has logged in.');
		await reactionRoles.fetchMessages()
		await registerPresence();
	}
}