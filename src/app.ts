import express, { NextFunction, Request, Response } from 'express';
import logger from './config/logger';
import { HttpError } from 'http-errors';
import authRouter from './routes/auth';
import tenantRouter from './routes/tenants';
import userRouter from './routes/users';
import cors from 'cors';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';

const app = express();
app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    }),
);

// Serve static files from the 'public' directory
app.use(express.static('public', { dotfiles: 'allow' }));

app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
    return res.send('Auth Service is running');
});

app.use('/auth', authRouter);
app.use('/tenants', tenantRouter);
app.use('/users', userRouter);

// Global error handler, This should be the last middleware to catch errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error('Global error handler:', err.message);
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    });
});
export default app;
