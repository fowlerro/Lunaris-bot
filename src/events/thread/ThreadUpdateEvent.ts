import { ThreadChannel } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";

export default class ThreadUpdateEvent extends BaseEvent {
    constructor() {
        super('threadUpdate');
    }
    
    async run(oldThread: ThreadChannel, newThread: ThreadChannel) {
    }
};