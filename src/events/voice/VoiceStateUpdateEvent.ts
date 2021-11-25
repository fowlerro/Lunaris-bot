import { VoiceState } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";

const xpSystem = require('../../modules/xpSystem');

export default class VoiceStateUpdateEvent extends BaseEvent {
  constructor() {
    super('voiceStateUpdate');
  }
  
  async run(oldState: VoiceState, newState: VoiceState) {
    if(!client.isOnline) return;
    if(newState.member?.user.bot) return;

    xpSystem.handleVoiceXp(client, oldState, newState);
  }
}