import { Request, Response } from 'express';
import { getGlobalEmojisService } from '../services/index.service';

export async function getGlobalEmojisController(req: Request, res: Response) {
	try {
		const emojis = await getGlobalEmojisService();

		return res.send(emojis);
	} catch (err) {
		logger.error(err);
		res.sendStatus(400);
	}
}
