// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelDelete
const { channelDeletedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class ChannelDeleteEvent extends BaseEvent {
  constructor() {
    super('channelDelete');
  }
  
  async run(client, channel) {
    channelDeletedLog(client, channel);
  }
}
