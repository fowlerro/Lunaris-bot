// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageReactionAdd
import { MessageReaction, User } from "discord.js";

import BaseEvent from "../../utils/structures/BaseEvent";

export default class MessageReactionAddEvent extends BaseEvent {
  constructor() {
    super('messageReactionAdd');
  }
  
  async run(reaction: MessageReaction, user: User) {
    if(!client.isOnline) return;
    console.log('identifier', reaction.emoji.identifier)
    console.log('id', reaction.emoji.id)
    console.log('name', reaction.emoji.name)
  }
}