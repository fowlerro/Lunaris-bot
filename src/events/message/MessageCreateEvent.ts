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
        const language = message.guild.preferredLocale === 'pl' ? 'pl' : 'en'
        if(message.mentions.users?.first()?.id === client.user?.id) return message.reply({
            content: t('command.pingInfo', language)
        })
        if(!client.isOnline) return;

        Levels.handleTextXp(message)
    }
};