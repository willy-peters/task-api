import mongoose from 'mongoose';
import config from './env.js';

const connectDB = async () => {
  try {
    
    mongoose.connection.on('disconnected', () =>
      console.warn('MongoDB disconnected')
    );
    mongoose.connection.on('reconnected', () =>
      console.log('MongoDB reconnected')
    );

    const conn = await mongoose.connect(config.mongoUri, {
      // Give up after 10s instead of the default 30s if no server is reachable
      serverSelectionTimeoutMS: 10000,
    });

    console.log(
      `MongoDB connected: ${conn.connection.host}/${conn.connection.name}`
    );
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await mongoose.connection.close();
};

export default connectDB;