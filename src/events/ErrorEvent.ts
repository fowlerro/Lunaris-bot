// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-error
import DiscordClient from "../types/client";
import BaseEvent from "../utils/structures/BaseEvent";
export default class ErrorEvent extends BaseEvent {
  constructor() {
    super('error');
  }
  
  async run(client: DiscordClient, error: Error) {
    console.log("Error!!! :)");
  }
}
