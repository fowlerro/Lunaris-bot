// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-guildBanRemove
import { Interaction } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";
import CommandHandler from "../../modules/CommandHandler";

export default class InteractionCreateEvent extends BaseEvent {
    constructor() {
        super('interactionCreate');
    }
    
    async run(interaction: Interaction) {
        if(!client.isOnline) return;

        if(interaction.isCommand() || interaction.isContextMenu()) CommandHandler.handle(interaction)
    }
}