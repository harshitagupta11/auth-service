import fs from 'fs';
import path from 'path';
import { NextFunction, Response } from 'express';
import { RegisterRequestBody } from '../types.ts';
import { UserService } from '../services/userService';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import { JwtPayload, sign } from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { Config } from '../config/index';

export class AuthController {
    userService: UserService;

    constructor(
        userService: UserService,
        private logger: Logger,
    ) {
        this.userService = userService;
    }
    async register(
        req: RegisterRequestBody,
        res: Response,
        next: NextFunction,
    ) {
        // Validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, email, password } = req.body;

        // Logging
        this.logger.debug('New request to register user', {
            firstName,
            lastName,
            email,
            password: '********', // Do not log passwords
        });

        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });
            this.logger.info('User has been registered successfully', {
                id: user.id,
            });
            let privateKey: Buffer;
            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, '../../certs/private.pem'),
                );
            } catch {
                const err = createHttpError(
                    500,
                    'Error while reading private key',
                );
                next(err);
                return;
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };
            const accessToken = sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h',
                issuer: 'auth-service',
            });
            const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
                algorithm: 'HS256',
                expiresIn: '1y',
                issuer: 'auth-service',
            });

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 60 * 60 * 1000, // 1 hour
                httpOnly: true, // very important
            });

            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
            });

            res.status(201).json({
                id: user.id,
            });
        } catch (error) {
            next(error);
            return;
        }
    }
}
