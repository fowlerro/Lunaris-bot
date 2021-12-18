import { VoiceState } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import xpSystem from "../../modules/xpSystem";

export default class VoiceStateUpdateEvent extends BaseEvent {
	constructor() {
		super('voiceStateUpdate');
	}
	
	async run(oldState: VoiceState, newState: VoiceState) {
		if(!client.isOnline) return;
		if(newState.member?.user.bot) return;

		xpSystem.handleVoiceXp(oldState, newState);
	}
}