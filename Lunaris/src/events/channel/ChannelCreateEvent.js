// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelCreate
const { channelCreatedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class ChannelCreateEvent extends BaseEvent {
  constructor() {
    super('channelCreate');
  }
  
  async run(client, channel) {
    if(!client.state) return;

    if(channel.type === 'dm') return;
    channelCreatedLog(client, channel);
  }
}