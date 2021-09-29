require('./strategies/discord');
const express = require('express');
const passport = require('passport');
const app = express();
const PORT = process.env.PORT || 3002;
const routes = require('./routes');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const Store = require('connect-mongo')(session);
const { graphqlHTTP } = require('express-graphql');
const schema = require('./graphql');


module.exports = async (client) => {
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    app.use(cors({
        origin: ['http://localhost:3000'],
        credentials: true,
    }))

    app.use(session({
        secret: process.env.SESSION_SECRET,
        cookie: {
            maxAge: 60000 * 60 * 24 * 7
        },
        resave: false,
        saveUninitialized: false,
        store: new Store({mongooseConnection: mongoose.connection}),
    }))

    app.use(passport.initialize());
    app.use(passport.session());

    app.use('/graphql', graphqlHTTP({
        graphiql: true,
        schema
    }))

    app.use('/api', routes);

    app.listen(PORT, () => console.log(`Running on Port ${PORT}`));
}