import { NextFunction, Response } from 'express';
import { AuthRequest, RegisterRequestBody } from '../types.ts';
import { UserService } from '../services/userService';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';
import { JwtPayload } from 'jsonwebtoken';
import { TokenService } from '../services/tokenService.js';
import createHttpError from 'http-errors';
import { CredentialService } from '../services/credentialService.js';
export class AuthController {
    userService: UserService;

    constructor(
        userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentialService: CredentialService,
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
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            // Persist the refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
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

    async login(req: RegisterRequestBody, res: Response, next: NextFunction) {
        // Validation
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, password } = req.body;

        // Logging
        this.logger.debug('New request to login a user', {
            email,
            password: '********', // Do not log passwords
        });
        // Check if username(email) exits in the database
        // Compare password
        // Generate Tokens
        // Add token to cookies
        // Return the response (id)
        try {
            const user = await this.userService.findByEmail(email);

            if (!user) {
                const err = createHttpError(
                    400,
                    'Email or password does not match.',
                );
                next(err);
                return;
            }
            // compare password
            const passwordMatch = await this.credentialService.comparePassword(
                password,
                user.password,
            );
            if (!passwordMatch) {
                const err = createHttpError(
                    400,
                    'Email or password does not match.',
                );
                next(err);
                return;
            }
            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            // Persist the refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
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
            this.logger.info('User has been logged in ', { id: user.id });
            res.json({
                id: user.id,
            });
        } catch (error) {
            next(error);
            return;
        }
    }

    async self(req: AuthRequest, res: Response) {
        const user = await this.userService.findById(Number(req.auth.sub));
        res.json({ ...user, password: undefined });
    }

    async refresh(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const payload: JwtPayload = {
                sub: String(req.auth.sub),
                role: req.auth.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            const user = await this.userService.findById(Number(req.auth.sub));
            if (!user) {
                const error = createHttpError(
                    400,
                    'User with the token could not find',
                );
                next(error);
                return;
            }

            // Persist the refresh token
            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user);

            // Delete the old refresh token
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
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
            this.logger.info('User has been logged in ', { id: user.id });
            res.json({
                id: user.id,
            });
        } catch (error) {
            next(error);
            return;
        }
    }

    async logout(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            await this.tokenService.deleteRefreshToken(Number(req.auth.id));
            this.logger.info('Refresh token has been deleted', {
                tokenId: req.auth.id,
            });
            this.logger.info('User has been logged out', { id: req.auth.sub });
            res.clearCookie('accessToken');
            res.clearCookie('refreshToken');
            return res.json({});
        } catch (err) {
            next(err);
        }
    }
}
