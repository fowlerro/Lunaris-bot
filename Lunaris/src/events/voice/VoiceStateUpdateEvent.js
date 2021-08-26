const xpSystem = require('../../modules/xpSystem');
const BaseEvent = require('../../utils/structures/BaseEvent');
module.exports = class VoiceStateUpdateEvent extends BaseEvent {
  constructor() {
    super('voiceStateUpdate');
  }
  
  async run(client, oldState, newState) {
    if(!client.isOnline) return;
    if(newState.member.user.bot) return;

    xpSystem.handleVoiceXp(client, oldState, newState);
  }
}