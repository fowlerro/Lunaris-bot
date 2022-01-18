// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildMemberRemove
import { GuildMember } from "discord.js";
import WelcomeMessage from "../../modules/WelcomeMessage";

import BaseEvent from "../../utils/structures/BaseEvent";

export default class GuildMemberRemoveEvent extends BaseEvent {
  constructor() {
    super('guildMemberRemove');
  }
  
  async run(member: GuildMember) {
    if(!client.isOnline) return;

    WelcomeMessage.sendMessage(member, 'leave')
  }
}