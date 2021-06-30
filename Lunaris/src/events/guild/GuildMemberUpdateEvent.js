// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
const GuildConfig = require('../../database/schemas/GuildConfig');
const { memberNicknameLog, memberRoleLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class GuildMemberUpdateEvent extends BaseEvent {
  constructor() {
    super('guildMemberUpdate');
  }
  
  async run(client, oldMember, newMember) {
    if(!client.state) return;
    if(oldMember.nickname !== newMember.nickname) {
      const guildConfig = await GuildConfig.findOne({guildID: newMember.guild.id}).catch();
      const logChannel = newMember.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
      const language = guildConfig.get('language');
      if(!logChannel) return;

      const auditLog = await newMember.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_UPDATE'});
      const update = auditLog.entries.first();
      if(!update ) return;
      const executor = update.executor;
      const target = update.target;
      const changes = update.changes.find(obj => obj.key === 'nick');
      const oldNickname = changes.old;
      const newNickname = changes.new;
      
      memberNicknameLog(client, executor, target, oldNickname, newNickname, logChannel, language);
    }

    if(oldMember._roles.length < newMember._roles.length) {
      const guildConfig = await GuildConfig.findOne({guildID: newMember.guild.id}).catch();
      const logChannel = newMember.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
      const language = guildConfig.get('language');
      if(!logChannel) return;

      const auditLog = await newMember.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_ROLE_UPDATE'});
      const update = auditLog.entries.first();
      if(!update || Date.now() - update.createdTimestamp > 5000) return;
      const {executor, target} = update;
      const addedRole = update.changes.find(obj => obj.key === '$add').new[0];
      if(addedRole.id === guildConfig.get('modules.autoMod.muteRole')) return;
      
      memberRoleLog(client, executor, target, addedRole.id, "add", logChannel, language);
    }

    if(oldMember._roles.length > newMember._roles.length) {
      const guildConfig = await GuildConfig.findOne({guildID: newMember.guild.id}).catch();
      const logChannel = newMember.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
      const language = guildConfig.get('language');
      if(!logChannel) return;

      const auditLog = await newMember.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_ROLE_UPDATE'});
      const update = auditLog.entries.first();
      if(!update || Date.now() - update.createdTimestamp > 5000) return;
      const {executor, target} = update;
      const removedRole = update.changes.find(obj => obj.key === '$remove').new[0];
      if(removedRole.id === guildConfig.get('modules.autoMod.muteRole')) return;
      
      memberRoleLog(client, executor, target, removedRole.id, "remove", logChannel, language);
    }
  }
}