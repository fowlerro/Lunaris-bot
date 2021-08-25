// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
const { Permissions } = require('discord.js');
const { memberLeavedLog, memberKickedLog, memberBannedLog } = require('../../modules/guildLogs');
const Guilds = require('../../modules/Guilds');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class GuildMemberRemoveEvent extends BaseEvent {
  constructor() {
    super('guildMemberRemove');
  }
  
  async run(client, member) {
    if(!client.isOnline) return;
    const guildConfig = await Guilds.config.get(client, member.guild.id);
    const logChannel = member.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
    if(!logChannel) return;
    const language = guildConfig.get('language');

    // KICK LOG 
    if(!member.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;
    const kickLog = await member.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_KICK'});
    const updateKick = kickLog.entries.first();
    if(updateKick.target.id === member.id) {
      if(Date.now() - updateKick.createdTimestamp < 5000) return memberKickedLog(client, updateKick.executor, updateKick.target, member, updateKick.reason, logChannel, language);
    }

    // BAN LOG
    if(!member.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;
    const banLog = await member.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_BAN_ADD'});
    const updateBan = banLog.entries.first();
    if(updateBan.target.id === member.id) {
      if(Date.now() - updateBan.createdTimestamp < 5000) return memberBannedLog(client, updateBan.executor, updateBan.target, member, updateBan.reason, logChannel, language);
    }

    memberLeavedLog(client, member, logChannel, language);
  }
}