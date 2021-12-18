import mongoose from 'mongoose'

export async function connectDatabase() {
    await mongoose.connect(process.env.DB_URL!);
}

mongoose.connection.on('connected', () => {
    console.log('Database connected successfully!');
})

mongoose.connection.on('error', err => console.error(err));