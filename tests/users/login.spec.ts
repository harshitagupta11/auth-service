import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';

describe('POST /auth/login', () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe.skip('Given all fields', () => {
        it('should login the user', async () => {});
    });
});
