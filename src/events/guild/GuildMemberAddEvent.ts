// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberAdd
import { GuildMember } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Guilds from "../../modules/Guilds";
import autoRole from "../../modules/autoRole";
import Mod from "../../modules/Mod";

export default class GuildMemberAddEvent extends BaseEvent {
  constructor() {
    super('guildMemberAdd');
  }
  
  async run(member: GuildMember) {
    if(!client.isOnline) return;
    // memberJoinedLog(client, member);
    const guildConfig = await Guilds.config.get(member.guild.id);
    if(guildConfig.modules.autoRole?.status) {
      autoRole.give(member)
    }
    Mod.mute.reassignRole(member.guild.id, member.id)
  }
}