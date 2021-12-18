//  https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
import { Guild } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";

export default class GuildCreateEvent extends BaseEvent {
	constructor() {
		super('guildCreate');
	}
  
	async run(guild: Guild) {
		if(!client.isOnline) return;
		// let guildConfig = await Guilds.config.get(guild.id);
		// if(guildConfig.error) {
		// 	await Guilds.config.create(guild.id)
		// }
	}
}