// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageUpdate
const GuildConfig = require('../../database/schemas/GuildConfig');
const { messageEditedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');
module.exports = class MessageUodateEvent extends BaseEvent {
  constructor() {
    super('messageUpdate');
  }
  
  async run(client, oldMessage, newMessage) {
    if(!newMessage.guild) return;
    
    if(oldMessage.content !== newMessage.content) {
      const guildConfig = await GuildConfig.findOne({guildID: newMessage.guild.id}).catch();
      const logChannel = newMessage.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.message'));
      const language = guildConfig.get('language');
      if(!logChannel) return;

      messageEditedLog(client, oldMessage.content, newMessage.content, newMessage.id, newMessage.channel.id, newMessage.guild.id, newMessage.author, logChannel, language)
    }
  }
}