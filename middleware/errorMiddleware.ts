import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
    status?: number;
    message: string;
}

// Error handling middleware
const errorMiddleware = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    console.error(`[ERROR] ${status} - ${message}`);
    res.status(status).json({
        status,
        message,
    });
};

export default errorMiddleware;
