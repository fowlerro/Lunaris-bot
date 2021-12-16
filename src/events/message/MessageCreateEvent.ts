import { Message } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import Guilds from "../../modules/Guilds";
import xpSystem from "../../modules/xpSystem";
import { translate } from "../../utils/languages/languages";

export default class MessageCreateEvent extends BaseEvent {
    constructor() {
        super('messageCreate');
    }
    
    async run(message: Message) {
        if(message.author.bot) return;
        if(!message.guild) return
        const { language } = await Guilds.config.get(message.guild.id);
        // CommandHandlerModule.handleCommand(client, message);
        if(message.mentions.users?.first()?.id === client.user?.id) return message.reply({
            content: translate(language, 'cmd.pingInfo')
        })


        if(message.content.startsWith('!test')) {
        }
        
        if(!client.isOnline) return;

        xpSystem.addTextXp(message);

    }
};