// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete
const BaseEvent = require('../../utils/structures/BaseEvent');
const GuildConfig = require('../../database/schemas/GuildConfig');
const CommandConfig = require('../../database/schemas/CommandConfig');
module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor() {
    super('guildDelete');
  }
  
  async run(client, guild) {
    if(!client.isOnline) return;
    await GuildConfig.deleteOne({guildId: guild.id});
    client.guildConfigs.delete(guild.id);
    await CommandConfig.deleteMany({guildId: guild.id});
  }
}