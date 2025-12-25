import mongoose from 'mongoose';
import config from './config';

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongodbUri);

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

export default connectDB;
