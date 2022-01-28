// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
import { GuildMember } from "discord.js";
import Logs from "../../modules/Logs";
import WelcomeMessage from "../../modules/WelcomeMessage";

import BaseEvent from "../../utils/structures/BaseEvent";

export default class GuildMemberRemoveEvent extends BaseEvent {
  constructor() {
    super('guildMemberRemove');
  }
  
  async run(member: GuildMember) {
    if(!client.isOnline) return;

    Logs.log('members', 'leave', member.guild.id, { member, customs: { memberRoles: member.roles.cache.filter(role => role.name !== 'everyone').map(role => `<@&${role.id}>`) } })
    WelcomeMessage.sendMessage(member, 'leave')
  }
}