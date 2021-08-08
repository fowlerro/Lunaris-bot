// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildBanRemove
const { memberUnbannedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class GuildBanRemoveEvent extends BaseEvent {
  constructor() {
    super('guildBanRemove');
  }
  
  async run(client, guild, user) {
    if(!client.isOnline) return;
    memberUnbannedLog(client, guild, user);
  }
}