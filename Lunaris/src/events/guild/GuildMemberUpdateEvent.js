// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
const GuildConfig = require('../../database/schemas/GuildConfig');
const { memberNicknameLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class GuildMemberUpdateEvent extends BaseEvent {
  constructor() {
    super('guildMemberUpdate');
  }
  
  async run(client, oldMember, newMember) {
    if(oldMember.nickname !== newMember.nickname) {
      const guildConfig = await GuildConfig.findOne({guildID: newMember.guild.id}).catch();
      const logChannel = newMember.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
      const language = guildConfig.get('language');
      if(!logChannel) return;

      const auditLog = await newMember.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_UPDATE'});
      const update = auditLog.entries.first();
      if(!update) return;
      const executor = update.executor;
      const target = update.target;
      const changes = update.changes.find(obj => obj.key === 'nick');
      const oldNickname = changes.old;
      const newNickname = changes.new;
      
      memberNicknameLog(client, executor, target, oldNickname, newNickname, logChannel, language);
    }
  }
}