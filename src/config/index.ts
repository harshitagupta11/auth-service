import { config } from 'dotenv';

config();

const { PORT, NODE_ENV } = process.env;
console.log('PORT:', PORT);
export const Config = {
    PORT,
    NODE_ENV,
};
