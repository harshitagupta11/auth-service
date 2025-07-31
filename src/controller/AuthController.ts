import { NextFunction, Response } from 'express';
import { RegisterRequestBody } from '../types.ts';
import { UserService } from '../services/userService';
import { Logger } from 'winston';

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
        const { firstName, lastName, email, password } = req.body;

        this.logger.debug('New request to register user', {
            firstName,
            lastName,
            email,
            password: '********', // Do not log passwords
        });
        if (!firstName || !lastName || !email || !password) {
            // const error = new HttpError(400);
        }

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
