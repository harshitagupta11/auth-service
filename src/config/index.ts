import { config } from 'dotenv';
import path from 'path';

config({
    path: path.join(__dirname, `../../.env.${process.env.NODE_ENV || 'dev'}`),
});

const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_URL,
    REFRESH_TOKEN_SECRET,
    JWKS_URI,
    PRIVATE_KEY,
} = process.env;
console.log(DB_URL);
console.log(JWKS_URI);
export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    DB_URL,
    REFRESH_TOKEN_SECRET,
    JWKS_URI,
    PRIVATE_KEY,
};
