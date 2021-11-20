//  https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
import { Guild } from "discord.js";
import DiscordClient from "../../types/client";
import BaseEvent from "../../utils/structures/BaseEvent";
const Guilds = require('../../modules/Guilds');

export default class GuildCreateEvent extends BaseEvent {
	constructor() {
		super('guildCreate');
	}
  
	async run(client: DiscordClient, guild: Guild) {
		if(!client.isOnline) return;
		let guildConfig = await Guilds.config.get(client, guild.id);
		if(guildConfig.error) {
			await Guilds.config.create(client, guild.id)
		}
	}
}