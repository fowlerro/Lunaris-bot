// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildBanRemove
import { GuildBan } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";

export default class GuildBanRemoveEvent extends BaseEvent {
  constructor() {
    super('guildBanRemove');
  }
  
  async run(ban: GuildBan) {
    if(!client.isOnline) return;
    // memberUnbannedLog(client, guild, user);
  }
}