// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-messageReactionAdd
const BaseEvent = require('../../utils/structures/BaseEvent');

module.exports = class MessageReactionAddEvent extends BaseEvent {
  constructor() {
    super('messageReactionAdd');
  }
  
  async run(client, reaction, user) {
    if(!client.isOnline) return;
    // console.log(reaction.emoji.identifier)
    // console.log(user);
  }
}