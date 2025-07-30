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

export { RegisterRequestBody, userData };
