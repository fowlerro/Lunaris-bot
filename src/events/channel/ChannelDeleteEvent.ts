// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelDelete
import { DMChannel, GuildChannel } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";


export default class ChannelDeleteEvent extends BaseEvent {
  constructor() {
    super('channelDelete');
  }
  
  async run(channel: DMChannel | GuildChannel) {
    if(!client.isOnline) return;
    // channelDeletedLog(client, channel);
  }
}
