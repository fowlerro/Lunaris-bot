// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageUpdate
import { Message } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";

export default class MessageUpdateEvent extends BaseEvent {
  constructor() {
    super('messageUpdate');
  }
  
  async run(oldMessage: Message, newMessage: Message) {
    if(!client.isOnline) return;
    if(!newMessage.guild || newMessage.author.bot) return;
    
    // if(oldMessage.content !== newMessage.content) {
    //   const guildConfig = await Guilds.config.get(client, newMessage.guild.id);
    //   const logChannel = newMessage.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.message'));
    //   if(!logChannel) return;
    //   const language = guildConfig.get('language');

    //   messageEditedLog(client, oldMessage.content, newMessage.content, newMessage.id, newMessage.channel.id, newMessage.guild.id, newMessage.author, logChannel, language)
    // }
  }
}