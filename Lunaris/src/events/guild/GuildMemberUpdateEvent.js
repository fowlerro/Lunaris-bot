// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
const { Permissions } = require('discord.js');
const { Mute } = require('../../modules/autoMod/utils');
const { memberNicknameLog, memberRoleLog } = require('../../modules/guildLogs');
const Guilds = require('../../modules/Guilds');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class GuildMemberUpdateEvent extends BaseEvent {
  constructor() {
    super('guildMemberUpdate');
  }
  
  async run(client, oldMember, newMember) {
    if(!client.isOnline) return;
    if(oldMember.nickname !== newMember.nickname) {
      if(!newMember.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return; //!important //TODO: Make permissions checking in all cases 

      const guildConfig = await Guilds.config.get(client, newMember.guild.id);
      const logChannel = newMember.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
      if(!logChannel) return;
      const language = guildConfig.get('language');

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

    if(oldMember._roles.length < newMember._roles.length) {
      if(!newMember.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

      const guildConfig = await Guilds.config.get(client, newMember.guild.id);
      const logChannel = newMember.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
      if(!logChannel) return;
      const language = guildConfig.get('language');

      const auditLog = await newMember.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_ROLE_UPDATE'});
      const update = auditLog.entries.first();
      if(!update || Date.now() - update.createdTimestamp > 5000) return;
      const {executor, target} = update;
      const addedRole = update.changes.find(obj => obj.key === '$add').new[0];
      if(addedRole.id === guildConfig.get('modules.autoMod.muteRole')) return //Mute.add(client, newMember.guild.id, target.id, 'Role add', executor.id);
      
      memberRoleLog(client, executor, target, addedRole.id, "add", logChannel, language);
    }

    if(oldMember._roles.length > newMember._roles.length) {
      if(!newMember.guild.me.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

      const guildConfig = await Guilds.config.get(client, newMember.guild.id);
      const logChannel = newMember.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
      const language = guildConfig.get('language');
      if(!logChannel) return;

      const auditLog = await newMember.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_ROLE_UPDATE'});
      const update = auditLog.entries.first();
      if(!update || Date.now() - update.createdTimestamp > 5000) return;
      const {executor, target} = update;
      const removedRole = update.changes.find(obj => obj.key === '$remove').new[0];
      if(removedRole.id === guildConfig.get('modules.autoMod.muteRole')) return //Mute.remove(client, newMember.guild.id, executor.id, target.id, 'Role remove');
      
      memberRoleLog(client, executor, target, removedRole.id, "remove", logChannel, language);
    }
  }
}