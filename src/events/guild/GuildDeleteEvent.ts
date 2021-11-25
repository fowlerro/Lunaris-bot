// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildDelete
import { Guild } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";
const CommandConfig = require('../../database/schemas/CommandConfig');
const Guilds = require('../../modules/Guilds');

export default class GuildDeleteEvent extends BaseEvent {
  constructor() {
    super('guildDelete');
  }
  
  async run(guild: Guild) {
    if(!client.isOnline) return;
    await Guilds.config.delete(client, guild.id);
    await CommandConfig.deleteMany({guildId: guild.id});
  }
}