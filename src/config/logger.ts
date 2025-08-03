import winston from 'winston';
import { Config } from '.';

const logger = winston.createLogger({
    level: 'info',
    defaultMeta: { serviceName: 'auth-service' },
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [
        new winston.transports.File({
            level: 'info',
            dirname: 'logs',
            filename: 'app.log',
            silent: false,
        }),
        new winston.transports.File({
            level: 'error',
            dirname: 'logs',
            filename: 'error.log',
            silent: true,
        }),

        new winston.transports.Console({
            level: 'info',
            silent: Config.NODE_ENV === 'production', // Disable console logging in production
        }),
    ],
});

export default logger;
