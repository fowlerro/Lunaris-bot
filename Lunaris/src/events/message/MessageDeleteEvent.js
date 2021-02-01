// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageDelete
const GuildConfig = require('../../database/schemas/GuildConfig');
const { messageDeletedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');
module.exports = class MessageDeleteEvent extends BaseEvent {
  constructor() {
    super('messageDelete');
  }
  
  async run(client, message) {
    // console.log(message);
    if(!message.guild || message.author.bot) return;
    const guildConfig = await GuildConfig.findOne({guildID: message.guild.id}).catch();
    const logChannel = message.guild.channels.cache.find(channel => channel.id === guildConfig.get('logs.message'));
    const language = guildConfig.get('language');
    if(!logChannel) return;

    const {content, channel} = message;
    const auditLog = await message.guild.fetchAuditLogs({limit: 1, type: 'MESSAGE_DELETE'});
    const entry = auditLog.entries.first();

    if(!entry) return messageDeletedLog(client, content, channel.id, message.author, null, logChannel, language)

    const {executor, target} = entry;

    if(target.id === message.author.id) {
      messageDeletedLog(client, content, channel.id, target, executor, logChannel, language)
    } else {
      messageDeletedLog(client, content, channel.id, message.author, null, logChannel, language)
    }

  }
}