require('dotenv').config(); // !!! OGARNĄĆ PORZĄDNE 'ENVIROMENT VARIABLES'
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

mongoose.connect('mongodb+srv://dbUser:JtwwkIEaZukU2SE6@cluster0.wsvos.mongodb.net/Lunaris?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

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

app.use('/api', routes);

app.listen(PORT, () => console.log(`Running on Port ${PORT}`));