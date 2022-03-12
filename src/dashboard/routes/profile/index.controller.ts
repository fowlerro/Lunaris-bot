import { Request, Response } from 'express';
import { getProfileService } from './index.service';

export async function getProfileController(req: Request, res: Response) {
	try {
		const profile = await getProfileService(req.user!.discordId);
		if (!profile) return res.sendStatus(500);

		return res.send(profile);
	} catch (err) {
		logger.error(err);
		res.sendStatus(400);
	}
}
