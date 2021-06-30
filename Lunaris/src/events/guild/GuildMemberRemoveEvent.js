// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
const GuildConfig = require('../../database/schemas/GuildConfig');
const { memberLeavedLog, memberKickedLog, memberBannedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class GuildMemberRemoveEvent extends BaseEvent {
  constructor() {
    super('guildMemberRemove');
  }
  
  async run(client, member) {
    if(!client.state) return;

    // const guildConfig = await GuildConfig.findOne({guildID: member.guild.id}).catch();
    const guildConfig = client.guildConfigs.get(member.guild.id);
    const logChannel = member.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
    const language = guildConfig.get('language');
    if(!logChannel) return;

    // KICK LOG 
    const kickLog = await member.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_KICK'});
    const updateKick = kickLog.entries.first();
    if(updateKick.target.id === member.id) {
      if(Date.now() - updateKick.createdTimestamp < 5000) return memberKickedLog(client, updateKick.executor, updateKick.target, member, updateKick.reason, logChannel, language);
    }

    // BAN LOG
    const banLog = await member.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_BAN_ADD'});
    const updateBan = banLog.entries.first();
    if(updateBan.target.id === member.id) {
      if(Date.now() - updateBan.createdTimestamp < 5000) return memberBannedLog(client, updateBan.executor, updateBan.target, member, updateBan.reason, logChannel, language);
    }

    memberLeavedLog(client, member, logChannel, language);
  }
}