// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelDelete
const { channelDeletedLog } = require('../../modules/guildLogs');
import { DMChannel, GuildChannel } from "discord.js";
import DiscordClient from "../../types/client";
import BaseEvent from "../../utils/structures/BaseEvent";


export default class ChannelDeleteEvent extends BaseEvent {
  constructor() {
    super('channelDelete');
  }
  
  async run(client: DiscordClient, channel: DMChannel | GuildChannel) {
    if(!client.isOnline) return;
    channelDeletedLog(client, channel);
  }
}
