// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildBanRemove
const { memberUnbannedLog } = require('../../modules/guildLogs');
import { GuildBan } from "discord.js";
import DiscordClient from "../../types/client";
import BaseEvent from "../../utils/structures/BaseEvent";


export default class GuildBanRemoveEvent extends BaseEvent {
  constructor() {
    super('guildBanRemove');
  }
  
  async run(client: DiscordClient, ban: GuildBan) {
    if(!client.isOnline) return;
    // memberUnbannedLog(client, guild, user);
  }
}