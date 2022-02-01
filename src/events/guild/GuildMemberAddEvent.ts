// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
import { GuildMember } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import autoRole from "../../modules/autoRole";
import Mod from "../../modules/Mod";
import WelcomeMessage from "../../modules/WelcomeMessage";
import Logs from "../../modules/Logs";

export default class GuildMemberAddEvent extends BaseEvent {
  constructor() {
    super('guildMemberAdd');
  }
  
  async run(member: GuildMember) {
    if(!client.isOnline) return;
 
    Logs.log('members', 'join', member.guild.id, { member })
    WelcomeMessage.sendMessage(member, 'join')
    autoRole.give(member)
    Mod.mute.reassignRole(member.guild.id, member.id)
  }
}