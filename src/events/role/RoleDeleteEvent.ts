// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleDelete
import { Role } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";

const { roleDeletedLog } = require('../../modules/guildLogs');

export default class RoleDeleteEvent extends BaseEvent {
  constructor() {
    super('roleDelete');
  }
  
  async run(role: Role) {
    if(!client.isOnline) return;

    roleDeletedLog(client, role);
  }
}