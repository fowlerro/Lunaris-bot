import './strategies/discord'
import express from 'express'
import session from 'express-session'
import cors from 'cors'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import passport from 'passport'

import routes from './routes'
import { UserDocument } from '../database/schemas/User'

declare global {
    namespace Express {
        interface User extends UserDocument {}
    }
}


const app = express();
const PORT = process.env.PORT || 3002;

export default async () => {
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    app.use(cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    }))

    app.enable('trust proxy')

    app.use(session({
        secret: process.env.SESSION_SECRET!,
        cookie: {
            maxAge: 60000 * 60 * 24 * 7,
            sameSite: 'none',
            secure: true
        },
        resave: false,
        saveUninitialized: false,
        proxy: true,
        store: MongoStore.create({
            // @ts-ignore
            client: mongoose.connection.getClient()
        })
    }))

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/', (req, res) => res.sendStatus(200))
    app.use('/api', routes);

    app.listen(PORT, () => logger.info(`Running on Port ${PORT}`));
}