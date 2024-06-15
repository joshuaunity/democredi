import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import sharedRoutes from '../routes/sharedRoutes';
import authRoutes from '../routes/authRoutes';
import userRoutes from '../routes/userRoutes';
import errorMiddleware from '../middleware/errorMiddleware';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(errorMiddleware);
app.use(cors());

// Routes
app.use('/v1/shared', sharedRoutes);
app.use('/v1/auth', authRoutes);
app.use('/v1/users', userRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
