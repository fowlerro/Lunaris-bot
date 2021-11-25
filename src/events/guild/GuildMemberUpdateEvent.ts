// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberUpdate
import { GuildMember, Permissions } from 'discord.js'
import { APIRole } from 'discord-api-types'
import BaseEvent from '../../utils/structures/BaseEvent';
const { Mute } = require('../../modules/Mod/utils');
const { memberNicknameLog, memberRoleLog } = require('../../modules/guildLogs');
const Guilds = require('../../modules/Guilds');

export default class GuildMemberUpdateEvent extends BaseEvent {
  constructor() {
    super('guildMemberUpdate');
  }
  
  async run(oldMember: GuildMember, newMember: GuildMember) {
    if(!client.isOnline) return;
    if(oldMember.nickname !== newMember.nickname) {
      if(!newMember.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return; //!important //TODO: Make permissions checking in all cases 

      const guildConfig = await Guilds.config.get(client, newMember.guild.id);
      const logChannel = newMember.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
      if(!logChannel) return;
      const language = guildConfig.get('language');

      const auditLog = await newMember.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_UPDATE'});
      const update = auditLog.entries.first();
      if(!update) return;
      const executor = update.executor;
      const target = update.target;
      const changes = update.changes?.find(obj => obj.key === 'nick');
      const oldNickname = changes?.old;
      const newNickname = changes?.new;
      
      memberNicknameLog(client, executor, target, oldNickname, newNickname, logChannel, language);
    }

    if(oldMember.roles.cache.size < newMember.roles.cache.size) {
      if(!newMember.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

      const guildConfig = await Guilds.config.get(client, newMember.guild.id);
      const logChannel = newMember.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
      if(!logChannel) return;
      const language = guildConfig.get('language');

      const auditLog = await newMember.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_ROLE_UPDATE'});
      const update = auditLog.entries.first();
      if(!update || Date.now() - update.createdTimestamp > 5000) return;
      const { executor, target } = update;
      const addedRole = update.changes?.find(obj => obj.key === '$add')?.new;
      const addedRoleId = (addedRole as APIRole[])[0].id
      if(addedRoleId === guildConfig.get('modules.autoMod.muteRole')) return //Mute.add(client, newMember.guild.id, target.id, 'Role add', executor.id);
      
      memberRoleLog(client, executor, target, addedRoleId, "add", logChannel, language);
    }

    if(oldMember.roles.cache.size > newMember.roles.cache.size) {
      if(!newMember.guild.me?.permissions.has(Permissions.FLAGS.VIEW_AUDIT_LOG)) return;

      const guildConfig = await Guilds.config.get(client, newMember.guild.id);
      const logChannel = newMember.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.member'));
      const language = guildConfig.get('language');
      if(!logChannel) return;

      const auditLog = await newMember.guild.fetchAuditLogs({limit: 1, type: 'MEMBER_ROLE_UPDATE'});
      const update = auditLog.entries.first();
      if(!update || Date.now() - update.createdTimestamp > 5000) return;
      const {executor, target} = update;
      const removedRole = update.changes?.find(obj => obj.key === '$remove')?.new;
      const removedRoleId = (removedRole as APIRole[])[0].id
      if(removedRoleId === guildConfig.get('modules.autoMod.muteRole')) return //Mute.remove(client, newMember.guild.id, executor.id, target.id, 'Role remove');
      
      memberRoleLog(client, executor, target, removedRoleId, "remove", logChannel, language);
    }
  }
}