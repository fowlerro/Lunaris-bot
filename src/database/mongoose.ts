import mongoose from 'mongoose';

export async function connectDatabase() {
	await mongoose.connect(process.env.DB_URL!);
}

mongoose.connection.on('connected', () => {
	logger.info('Database connected successfully!');
});

mongoose.connection.on('error', err => logger.error(err));

export const optionalSnowflake = (val: string) => val.length === 18 || val.length === 0;
