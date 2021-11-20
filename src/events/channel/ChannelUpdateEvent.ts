// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelUpdate
const { channelUpdatedLog } = require('../../modules/guildLogs');
import { DMChannel, GuildChannel } from "discord.js";
import DiscordClient from "../../types/client";
import BaseEvent from "../../utils/structures/BaseEvent";


export default class ChannelUpdateEvent extends BaseEvent {
  constructor() {
    super('channelUpdate');
  }
  
  async run(client: DiscordClient, oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel) {
    if(!client.isOnline) return;
    channelUpdatedLog(client, oldChannel, newChannel);
  }
}