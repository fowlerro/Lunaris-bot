// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageDelete
import { Message } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";

export default class MessageDeleteEvent extends BaseEvent {
  constructor() {
    super('messageDelete');
  }
  
  async run(message: Message) {
    if(!client.isOnline) return;
    // if(!message.guild || message.author.bot) return;
    // const guildConfig = await Guilds.config.get(client, message.guild.id);
    // const logChannel = message.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.message'));
    // if(!logChannel) return;
    // const language = guildConfig.get('language');

    // const {content, channel} = message;
    // const auditLog = await message.guild.fetchAuditLogs({ limit: 1, type: 'MESSAGE_DELETE' });
    // const entry = auditLog.entries.first();

    // if(!entry) return messageDeletedLog(client, content, channel.id, message.author, null, logChannel, language)

    // const {executor, target} = entry;

    // if((target as User)?.id === message.author.id) {
    //   messageDeletedLog(client, content, channel.id, target, executor, logChannel, language)
    // } else {
    //   messageDeletedLog(client, content, channel.id, message.author, null, logChannel, language)
    // }

  }
}