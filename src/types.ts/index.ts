import { Request } from 'express';

interface userData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}
interface RegisterRequestBody extends Request {
    body: userData;
}

interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
    };
}
type Authcookie = {
    accessToken: string;
};

export { RegisterRequestBody, userData, AuthRequest, Authcookie };
