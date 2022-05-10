import './strategies/discord';
import express, { Express } from 'express';
import session from 'express-session';
import cors from 'cors';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import passport from 'passport';

import routes from './routes';
import { User as UserType } from '../database/schemas/User';

declare global {
	namespace Express {
		interface User extends UserType {}
	}
}

const PORT = process.env.PORT || 3002;

function createApp(): Express {
	const app = express();

	app.use(express.json());
	app.use(express.urlencoded({ extended: false }));

	app.use(
		cors({
			origin: [process.env.FRONTEND_DOMAIN!],
			credentials: true,
		})
	);

	app.enable('trust proxy');
	app.use((req, res, next) => {
		if (process.env.NODE_ENV === 'production' && !req.secure)
			return res.redirect(`https://${req.headers.host}${req.url}`);
		next();
	});

	app.use(
		session({
			secret: process.env.SESSION_SECRET!,
			cookie: {
				maxAge: 60000 * 60 * 24 * 7,
				domain: process.env.NODE_ENV === 'production' ? 'lunaris.pro' : undefined,
			},
			resave: false,
			saveUninitialized: false,
			store: MongoStore.create({
				// @ts-ignore
				client: mongoose.connection.getClient(),
			}),
		})
	);

	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/', (req, res) => res.sendStatus(200));
	app.use('/api', routes);

	return app;
}

export default async () => {
	const app = createApp();

	app.listen(PORT, () => logger.info(`Running on Port ${PORT}`));
};
