// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
const { channelCreatedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class ChannelCreateEvent extends BaseEvent {
  constructor() {
    super('channelCreate');
  }
  
  async run(client, channel) {
    channelCreatedLog(client, channel);
  }
}