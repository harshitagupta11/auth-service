import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';
import createJWKSMock from 'mock-jwks';

describe('POST, /auth/users', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5555');
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        // Clear the database before each test
        // This will ensure that each test starts with a clean slate
        // and does not depend on the state left by previous tests
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwks.stop();
    });
    afterAll(async () => {
        await connection.destroy();
    });

    describe('Given all fields', () => {
        it('should persist the user in the database', async () => {
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: 'gupta@gmail.com',
                password: 'password123',
                tenantId: 1,
            };
            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            });
            await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            // Assert
            expect(users).toHaveLength(1);
            expect(users[0].email).toBe(userData.email);
        });

        it('should create manager user', async () => {
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: 'gupta@gmail.com',
                password: 'password123',
                tenantId: 1,
            };
            const adminToken = jwks.token({
                sub: '1',
                role: Roles.ADMIN,
            });
            await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            // Assert
            expect(users).toHaveLength(1);
            expect(users[0].role).toBe(Roles.MANAGER);
        });
        // it.todo(
        //     'should return 403 if non admin user tries to create a user',
        //     () => {},
        // );
    });
});
