import { VoiceState } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Levels from "../../modules/Levels";

export default class VoiceStateUpdateEvent extends BaseEvent {
	constructor() {
		super('voiceStateUpdate');
	}
	
	async run(oldState: VoiceState, newState: VoiceState) {
		if(!client.isOnline) return;
		if(newState.member?.user.bot) return;

		Levels.handleVoiceXp(oldState, newState);
	}
}