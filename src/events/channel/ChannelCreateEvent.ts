// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
const { channelCreatedLog } = require('../../modules/guildLogs');
import { DMChannel, GuildChannel } from "discord.js";
import DiscordClient from "../../types/client";
import BaseEvent from "../../utils/structures/BaseEvent";

export default class ChannelCreateEvent extends BaseEvent {
  constructor() {
    super('channelCreate');
  }
  
  async run(client: DiscordClient, channel: DMChannel | GuildChannel) {
    if(!client.isOnline) return;

    if(channel.type === 'DM') return;
    channelCreatedLog(client, channel);
  }
}