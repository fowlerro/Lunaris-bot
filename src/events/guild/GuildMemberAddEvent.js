// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
const { Mute } = require('../../modules/Mod/utils');
const autoRole = require('../../modules/autoRole');
const { memberJoinedLog } = require('../../modules/guildLogs');
const Guilds = require('../../modules/Guilds');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class GuildMemberAddEvent extends BaseEvent {
  constructor() {
    super('guildMemberAdd');
  }
  
  async run(client, member) {
    if(!client.isOnline) return;
    memberJoinedLog(client, member);
    const guildConfig = await Guilds.config.get(client, member.guild.id);
    if(guildConfig.get('modules.autoRole.status')) {
      autoRole.give(member);
    }
    Mute.reassignRole(client, member.guild.id, member.id);
  }
}