// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
  const { memberLeavedLog } = require('../modules/guildLogs');
const BaseEvent = require('../utils/structures/BaseEvent');
module.exports = class GuildMemberRemoveEvent extends BaseEvent {
  constructor() {
    super('guildMemberRemove');
  }
  
  async run(client, member) {
    memberLeavedLog(client, member);
  }
}