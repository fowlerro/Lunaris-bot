// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleCreate
import { Role } from "discord.js";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";
import { sleep } from "../../utils/utils";

export default class RoleCreateEvent extends BaseEvent {
    constructor() {
        super('roleCreate');
    }
    
    async run(role: Role) {
        if(!client.isOnline) return;

        serverLogs(role)
    }
}

async function serverLogs(role: Role) {
    await sleep(500)
    const auditLogs = await role.guild.fetchAuditLogs({ type: 'ROLE_CREATE', limit: 1 }).catch((e) => {console.log(e)})
    if(!auditLogs) return
    const roleLog = auditLogs.entries.first()
    if(!roleLog) return

    const { executor, target } = roleLog
    if(!executor || target?.id !== role.id) return

    Logs.log('roles', 'create', role.guild.id, { role, customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id } })
}