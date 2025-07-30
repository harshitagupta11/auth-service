import { Response } from 'express';
import { RegisterRequestBody } from '../types.ts';
import { UserService } from '../services/userService';

export class AuthController {
    userService: UserService;

    constructor(userService: UserService) {
        this.userService = userService;
    }
    async register(req: RegisterRequestBody, res: Response) {
        const { firstName, lastName, email, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            // const error = new HttpError(400);
        }

        await this.userService.create({ firstName, lastName, email, password });

        res.status(201).json({
            message: 'User registered successfully',
        });
    }
}
