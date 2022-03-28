import { Request, Response } from 'express';

import { getLevelConfigService, setLevelConfigService } from '../services/levels.service';

import type { LevelConfigPageData } from 'types';

export async function getLevelConfigController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;

		const data = await getLevelConfigService(guildId);
		return res.send(data);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}

export async function setLevelConfigController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;
		const payload: LevelConfigPageData = req.body;
		if (!guildId) return res.sendStatus(400);
		if (!payload) return res.status(400).send('Payload not found');
		if (typeof payload.status !== 'boolean') return res.status(400).send('Invalid status');

		const data = await setLevelConfigService(guildId, payload);

		return res.send(data);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}
