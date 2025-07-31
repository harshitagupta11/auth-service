import { NextFunction, Response } from 'express';
import { RegisterRequestBody } from '../types.ts';
import { UserService } from '../services/userService';
import { Logger } from 'winston';
import { validationResult } from 'express-validator';

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
            res.status(201).json({
                id: user.id,
            });
        } catch (error) {
            next(error);
            return;
        }
    }
}
