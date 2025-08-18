import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Config } from '.';

export const AppDataSource = new DataSource({
    type: 'postgres',
    // host: Config.DB_HOST,
    // port: Number(Config.DB_PORT),
    // username: Config.DB_USERNAME,
    // password: Config.DB_PASSWORD,
    // database: Config.DB_NAME,
    url: Config.DB_URL,
    // ssl:
    //     process.env.NODE_ENV !== 'dev'
    //         ? { rejectUnauthorized: false } // cloud DBs like Heroku need this
    //         : false,
    synchronize: false, // false in production
    logging: false,
    entities: ['src/entity/*.{ts,js}'],
    migrations: ['src/migration/*.{ts,js}'],
    subscribers: [],
});
