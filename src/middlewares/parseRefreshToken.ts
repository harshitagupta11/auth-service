import { expressjwt } from 'express-jwt';
import { Config } from '../config';
import { Request } from 'express';
import { Authcookie } from '../types.ts';

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ['HS256'],
    getToken(req: Request) {
        const { refreshToken } = req.cookies as Authcookie;
        return refreshToken;
    },
});
