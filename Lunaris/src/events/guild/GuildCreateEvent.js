//  https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildCreate
const BaseEvent = require('../../utils/structures/BaseEvent');
const GuildConfig = require('../../database/schemas/GuildConfig');
const CommandConfig = require('../../database/schemas/CommandConfig');

const infoLog = 'GuildLOG -> ';

module.exports = class GuildCreateEvent extends BaseEvent {
  constructor() {
    super('guildCreate');
  }
  
  async run(client, guild) {
    try {
      const guildConfig = await GuildConfig.findOne({guildID: guild.id});
      if(!guildConfig) {
        await GuildConfig.create({
          guildID: guild.id,
        });
      }

      // for(const [key, command] of client.commands) {
      //   if(command.ownerOnly) continue;
      //   let cmdConfig = await CommandConfig.find({guildID: guild.id, name: command.name});
      //   if(cmdConfig.length) continue;
      //   await CommandConfig.create({
      //     guildID: guild.id,
      //     name: command.name,
      //     aliases: command.aliases,
      //     minArgs: command.minArgs,
      //     maxArgs: command.maxArgs,
      //     autoRemove: command.autoRemove,
      //     autoRemoveResponse: command.autoRemoveResponse,
      //     requiredChannels: command.requiredChannels,
      //     blockedChannels: command.blockedChannels,
      //     requiredRoles: command.requiredRoles,
      //     blockedRoles: command.blockedRoles,
      //     cooldownStatus: command.cooldownStatus,
      //     cooldown: command.cooldown,
      //     cooldownPermissions: command.cooldownPermissions,
      //     cooldownChannels: command.cooldownChannels,
      //     cooldownRoles: command.cooldownRoles,
      //     cooldownReminder: command.cooldownReminder,
      //   });
      //   console.log(infoLog + `Nowa komenda '${command.name}' zapisana do DB || '${guild.name}' || '${guild.id}'`)
      // }
      console.log(infoLog + 'Bot dołączył na serwer "' + guild.name + '" || "' + guild.id + '". Zapisano config.');
    } catch(err) {
        console.log(infoLog + err + ' || events/GuildCreateEvent.js');
    }
  }
}