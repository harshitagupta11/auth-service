import { Request, Response } from 'express';

export class AuthController {
    register(req: Request, res: Response) {
        // const { firstName, lastName, email, password } = req.body;
        // if (!firstName || !lastName || !email || !password) {
        //     // const error = new HttpError(400);
        // }
        res.status(201).json({
            message: 'User registered successfully',
        });
    }
}
