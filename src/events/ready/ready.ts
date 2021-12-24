import BaseEvent from "../../utils/structures/BaseEvent";
import { registerPresence } from "../../utils/registry";

export default class ReadyEvent extends BaseEvent {
	constructor() {
		super('ready');
	}

	async run() {
		console.log(client.user?.tag + ' has logged in.');
		await registerPresence();
	}
}