import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import sharedRoutes from '../routes/sharedRoutes';
import authRoutes from '../routes/authRoutes';
import userRoutes from '../routes/userRoutes';
import kycRoutes from '../routes/kycRoutes';
import walletRoutes from '../routes/walletRoutes';
import transactionRoutes from '../routes/transactionRoutes';
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
app.use('/v1/kyc', kycRoutes);
app.use('/v1/wallets', walletRoutes);
app.use('/v1/transactions', transactionRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;
