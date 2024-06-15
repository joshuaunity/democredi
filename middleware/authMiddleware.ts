import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';


const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const decoded = jwt.verify(token, config.jwt.secret);
        req.body.user = decoded;
        next();
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
}

export default authMiddleware;