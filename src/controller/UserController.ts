import { NextFunction, Response } from 'express';
import { Logger } from 'winston';
import { UserService } from '../services/userService';
import { CreateUserRequestBody } from '../types.ts';
import { Roles } from '../constants';

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async create(
        req: CreateUserRequestBody,
        res: Response,
        next: NextFunction,
    ) {
        this.logger.debug('Request for creating a user', req.body);
        const { firstName, lastName, email, password } = req.body;
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: Roles.MANAGER,
            });
            res.status(201).json({ id: user.id });
        } catch (err) {
            next(err);
            return;
        }
    }
}
