// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelUpdate
import { DMChannel, GuildChannel } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";


export default class ChannelUpdateEvent extends BaseEvent {
  constructor() {
    super('channelUpdate');
  }
  
  async run(oldChannel: DMChannel | GuildChannel, newChannel: DMChannel | GuildChannel) {
    if(!client.isOnline) return;
    // channelUpdatedLog(client, oldChannel, newChannel);
  }
}