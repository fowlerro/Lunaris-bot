// https://discord.js.org/#/docs/main/stable/class/Client?scrollTo=e-roleUpdate
import { Role } from "discord.js";
import Logs from "../../modules/Logs";

import BaseEvent from "../../utils/structures/BaseEvent";
import { sleep } from "../../utils/utils";

export default class RoleUpdateEvent extends BaseEvent {
	constructor() {
		super('roleUpdate');
	}
	
	async run(oldRole: Role, newRole: Role) {
		if(!client.isOnline) return;

		
		// console.log({ oldRole, newRole })
		// serverLogs(oldRole, newRole)
	}
}

async function serverLogs(oldRole: Role, newRole: Role) {
    await sleep(500)
    const auditLogs = await newRole.guild.fetchAuditLogs({ type: 'ROLE_UPDATE', limit: 1 }).catch((e) => {console.log(e)})
    if(!auditLogs) return
    const roleLog = auditLogs.entries.first()
    if(!roleLog) return

    const { executor, target } = roleLog
    if(!executor || target?.id !== newRole.id) return

	const roleEdits = ""

    Logs.log('roles', 'edit', newRole.guild.id, { role: newRole, customs: { moderatorMention: `<@${executor.id}>`, moderatorId: executor.id, roleEdits } })
}