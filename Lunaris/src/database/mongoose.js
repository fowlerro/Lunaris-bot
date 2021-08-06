const mongoose = require('mongoose');

function connectDatabase() {
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    });
}

mongoose.connection.on('connected', () => {
    console.log('Database connected successfully!');
})

mongoose.connection.on('error', err => console.error(err));

module.exports = {connectDatabase}