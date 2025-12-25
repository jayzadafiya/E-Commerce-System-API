import config from './config/config';
import app from './app';
import connectDB from './config/database';

const startServer = async () => {
  try {
    await connectDB();

    app.listen(config.port, () => {
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`API URL: http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer();
