// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete
const BaseEvent = require('../../utils/structures/BaseEvent');
const CommandConfig = require('../../database/schemas/CommandConfig');
const Guilds = require('../../modules/Guilds');
module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor() {
    super('guildDelete');
  }
  
  async run(client, guild) {
    if(!client.isOnline) return;
    await Guilds.config.delete(client, guild.id);
    await CommandConfig.deleteMany({guildId: guild.id});
  }
}