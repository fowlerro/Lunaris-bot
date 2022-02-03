// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete
import { Guild } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Guilds from "../../modules/Guilds";

export default class GuildDeleteEvent extends BaseEvent {
  constructor() {
    super('guildDelete');
  }
  
  async run(guild: Guild) {
    if(!client.isOnline) return;
    await Guilds.config.delete(guild.id);
  }
}