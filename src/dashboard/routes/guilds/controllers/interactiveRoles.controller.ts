import { Request, Response } from 'express';

import { getInteractiveRolesService } from '../services/interactiveRoles.service';

export async function getInteractiveRolesController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;

		const data = await getInteractiveRolesService(guildId);
		return res.send(data);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}
