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

	app.set('trust proxy', 1);

	app.use(
		cors({
			origin: [process.env.FRONTEND_DOMAIN!],
			credentials: true,
		})
	);

	app.use((req, res, next) => {
		res.header('Access-Control-Allow-Origin', process.env.FRONTEND_DOMAIN!);
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
		next();
	});

	app.use(
		session({
			secret: process.env.SESSION_SECRET!,
			cookie: {
				maxAge: 60000 * 60 * 24 * 7,
				domain: `.${process.env.FRONTEND_DOMAIN!}`,
				sameSite: process.env.DEVELOPMENT === 'DEV' ? 'lax' : 'none',
				secure: process.env.DEVELOPMENT !== 'DEV',
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
