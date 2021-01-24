// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-channelUpdate
const { channelUpdatedLog } = require('../../modules/guildLogs');
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class ChannelUpdateEvent extends BaseEvent {
  constructor() {
    super('channelUpdate');
  }
  
  async run(client, oldChannel, newChannel) {
    channelUpdatedLog(client, oldChannel, newChannel);
  }
}