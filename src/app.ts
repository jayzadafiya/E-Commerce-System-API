import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import apiRoutes from './routes';
import { errorHandler, notFound } from './middlewares/errorHandler';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', apiRoutes);

app.use(notFound);

app.use(errorHandler);

export default app;
