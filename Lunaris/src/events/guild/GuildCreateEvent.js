//  https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
const BaseEvent = require('../../utils/structures/BaseEvent');
const GuildConfig = require('../../database/schemas/GuildConfig');
const Guilds = require('../../modules/Guilds');

module.exports = class GuildCreateEvent extends BaseEvent {
	constructor() {
		super('guildCreate');
	}
  
	async run(client, guild) {
		if(!client.isOnline) return;
		let guildConfig = await Guilds.config.get(client, guild.id);
		if(guildConfig.error) {
			await Guilds.config.create(client, guild.id)
		}
	}
}