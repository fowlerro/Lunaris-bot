import { Request, Response } from 'express';
import { User } from 'types';
import { getAuthService } from './index.service';

export async function getAuthController(req: Request, res: Response) {
	try {
		const { data } = await getAuthService(req.user!.accessToken);
		const user: User = {
			discordId: data.id,
			discordTag: `${data.username}#${data.discriminator as unknown as number}`,
			avatar: data.avatar,
		};
		user ? res.send(user) : res.status(401).send('Unauthorized');
	} catch (err) {
		logger.error(err);
		res.sendStatus(400);
	}
}
