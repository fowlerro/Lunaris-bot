// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
const { Mute } = require('../../modules/autoMod/utils');
const { giveAutoRole } = require('../../modules/autoRole');
const { memberJoinedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class GuildMemberAddEvent extends BaseEvent {
  constructor() {
    super('guildMemberAdd');
  }
  
  async run(client, member) {
    if(!client.state) return;
    memberJoinedLog(client, member);
    if(client.guildConfigs.get(member.guild.id).modules.autoRole.status) {
      giveAutoRole(member);
    }
    Mute.reassignRole(client, member.guild.id, member.id);
  }
}