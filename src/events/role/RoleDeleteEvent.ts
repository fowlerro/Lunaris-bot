// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleDelete
import { Role } from "discord.js";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";
import { getAuditLog } from "../../utils/utils";

export default class RoleDeleteEvent extends BaseEvent {
    constructor() {
        super('roleDelete');
    }
    
    async run(role: Role) {
        if(!client.isOnline) return;

        serverLogs(role)
    }
}

async function serverLogs(role: Role) {
    const log = await getAuditLog(role.guild, 'ROLE_DELETE', (log) => (log.target?.id === role.id))
    if(!log || !log.executor) return

    Logs.log('roles', 'delete', role.guild.id, { role, customs: { moderatorMention: `<@${log.executor.id}>`, moderatorId: log.executor.id } })
}