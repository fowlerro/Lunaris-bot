// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete
const BaseEvent = require('../../utils/structures/BaseEvent');
const GuildConfig = require('../../database/schemas/GuildConfig');
const CommandConfig = require('../../database/schemas/CommandConfig');

const infoLog = 'GuildLOG -> ';

module.exports = class GuildDeleteEvent extends BaseEvent {
  constructor() {
    super('guildDelete');
  }
  
  async run(client, guild) {
      try {
        await GuildConfig.deleteOne({guildID: guild.id});
        client.guildConfigs.delete(guild.id);
        await CommandConfig.deleteMany({guildID: guild.id});
        console.log(infoLog + 'Bot opuścił serwer "' + guild.name + '" || "' + guild.id + '". Usunięto config.');
      } catch {
        console.log(infoLog + 'Error: ' + err + ' || events/GuildDeleteEvent.js');
      }
  }
}