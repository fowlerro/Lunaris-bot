//  https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
const BaseEvent = require('../../utils/structures/BaseEvent');
const GuildConfig = require('../../database/schemas/GuildConfig');

const infoLog = 'GuildLOG -> ';

module.exports = class GuildCreateEvent extends BaseEvent {
  constructor() {
    super('guildCreate');
  }
  
  async run(client, guild) {
    if(!client.state) return;
    try {
      let guildConfig = client.guildConfigs.get(guild.id);
      if(!guildConfig) {
        guildConfig = await GuildConfig.create({
          guildID: guild.id,
        })
        client.guildConfigs.set(guild.id, guildConfig);
        }

      console.log(infoLog + 'Bot dołączył na serwer "' + guild.name + '" || "' + guild.id + '". Zapisano config.');
    } catch(err) {
        console.log(infoLog + err + ' || events/GuildCreateEvent.js');
    }
  }
}