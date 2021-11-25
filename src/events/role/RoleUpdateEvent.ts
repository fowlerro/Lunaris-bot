// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleUpdate
import { Role } from "discord.js";
import BaseEvent from "../../utils/structures/BaseEvent";

const { roleUpdatedLog } = require('../../modules/guildLogs');

export default class RoleUpdateEvent extends BaseEvent {
  constructor() {
    super('roleUpdate');
  }
  
  async run(oldRole: Role, newRole: Role) {
    if(!client.isOnline) return;

    roleUpdatedLog(client, newRole);
  }
}