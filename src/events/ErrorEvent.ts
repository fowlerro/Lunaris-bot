// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-error
import DiscordClient from "../typings/client";

import BaseEvent from "../utils/structures/BaseEvent";
export default class ErrorEvent extends BaseEvent {
	constructor() {
		super('error');
	}
	
	async run(client: DiscordClient, error: Error) {
		logger.warn("Error!!! :)");
	}
}
