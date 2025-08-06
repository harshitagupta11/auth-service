import { Request } from 'express';

interface userData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}
interface RegisterRequestBody extends Request {
    body: userData;
}

interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
        id?: string;
    };
}
type Authcookie = {
    accessToken: string;
    refreshToken: string;
};

interface IRefreshTokenPayload {
    id: string;
}

interface ITenant {
    name: string;
    address: string;
}
interface TenanatRequestBody extends Request {
    body: ITenant;
}
interface CreateUserRequestBody extends Request {
    body: userData;
}
export {
    RegisterRequestBody,
    userData,
    AuthRequest,
    Authcookie,
    IRefreshTokenPayload,
    ITenant,
    TenanatRequestBody,
    CreateUserRequestBody,
};
