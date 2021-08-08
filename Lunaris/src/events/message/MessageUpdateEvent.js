// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageUpdate
const { messageEditedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');
module.exports = class MessageUodateEvent extends BaseEvent {
  constructor() {
    super('messageUpdate');
  }
  
  async run(client, oldMessage, newMessage) {
    if(!client.isOnline) return;
    if(!newMessage.guild || newMessage.author.bot) return;
    
    if(oldMessage.content !== newMessage.content) {
      const guildConfig = client.guildConfigs.get(newMessage.guild.id)
      const logChannel = newMessage.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.message'));
      if(!logChannel) return;
      const language = guildConfig.get('language');

      messageEditedLog(client, oldMessage.content, newMessage.content, newMessage.id, newMessage.channel.id, newMessage.guild.id, newMessage.author, logChannel, language)
    }
  }
}