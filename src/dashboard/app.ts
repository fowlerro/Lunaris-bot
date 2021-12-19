import './strategies/discord'
import express from 'express'
import session from 'express-session'
// import { graphqlHTTP } from 'express-graphql'
import cors from 'cors'
import mongoose from 'mongoose'
import connectMongo from 'connect-mongo'
import passport from 'passport'

import routes from './routes'
// import schema from './graphql'
import { UserDocument } from '../database/schemas/User'

declare global {
    namespace Express {
        interface User extends UserDocument {
            
        }
    }
}


const app = express();
const PORT = process.env.PORT || 3002;
const Store = connectMongo(session)


export default async () => {
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    app.use(cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    }))

    app.use(session({
        secret: process.env.SESSION_SECRET!,
        cookie: {
            maxAge: 60000 * 60 * 24 * 7
        },
        resave: false,
        saveUninitialized: false,
        store: new Store({ mongooseConnection: mongoose.connection }),
    }))

    app.use(passport.initialize());
    app.use(passport.session());

    // app.use('/graphql', graphqlHTTP({
    //     graphiql: true,
    //     schema
    // }))

    app.use('/api', routes);

    app.listen(PORT, () => console.log(`Running on Port ${PORT}`));
}