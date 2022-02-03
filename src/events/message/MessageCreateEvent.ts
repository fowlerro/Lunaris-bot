import { Message } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Levels from "../../modules/Levels";

export default class MessageCreateEvent extends BaseEvent {
    constructor() {
        super('messageCreate');
    }
    
    async run(message: Message) {
        if(message.author.bot) return;
        if(!message.guild) return
        if(!client.isOnline) return;

        Levels.handleTextXp(message)
    }
};