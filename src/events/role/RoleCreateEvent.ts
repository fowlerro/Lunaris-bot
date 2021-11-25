// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleCreate
import { Role } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";

const { roleCreatedLog } = require('../../modules/guildLogs');

export default class RoleCreateEvent extends BaseEvent {
  constructor() {
    super('roleCreate');
  }
  
  async run(role: Role) {
    if(!client.isOnline) return;

    roleCreatedLog(client, role);
  }
}