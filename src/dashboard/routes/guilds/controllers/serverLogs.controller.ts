import { Request, Response } from 'express';
import { GuildLogsPageData } from 'types';
import { getServerLogsService, setServerLogsService } from '../services/serverLogs.service';

export async function getServerLogsController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;

		const data = await getServerLogsService(guildId);
		return res.send(data);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}

export async function setServerLogsController(req: Request, res: Response) {
	try {
		const { guildId } = req.params;
		const payload: GuildLogsPageData = req.body;
		if (!guildId) return res.sendStatus(400);
		if (!payload) return res.status(400).send('Payload not found');
		if (typeof payload.status !== 'boolean') return res.status(400).send('Invalid status');

		await setServerLogsService(guildId, payload);

		return res.sendStatus(200);
	} catch (err) {
		logger.error(err);
		res.sendStatus(500);
	}
}
