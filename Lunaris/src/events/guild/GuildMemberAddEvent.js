// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
const { giveAutoRole } = require('../../modules/autoRole');
const { memberJoinedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class GuildMemberAddEvent extends BaseEvent {
  constructor() {
    super('guildMemberAdd');
  }
  
  async run(client, member) {
    memberJoinedLog(client, member);
    if(client.guildConfigs.get(member.guild.id).modules.autoRole.status) {
      giveAutoRole(member);
    }
  }
}