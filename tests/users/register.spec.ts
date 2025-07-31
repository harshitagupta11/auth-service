import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { truncateTables } from './utils';
import { User } from '../../src/entity/User';

describe('POST /auth/register', () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Clear the database before each test
        // This will ensure that each test starts with a clean slate
        // and does not depend on the state left by previous tests
        await truncateTables(connection);
    });

    afterAll(async () => {
        await connection.destroy();
    });

    // Happy path test
    describe('Given all fields', () => {
        it('should return 201 status code', async () => {
            // follow AAA pattern
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: 'gupta@gmail.com',
                password: 'password123',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            expect(response.statusCode).toBe(201);
        });

        it('should return valid json response', async () => {
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: 'gupta@gmail.com',
                password: 'password123',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            );
        });

        it('should persist user in the database', async () => {
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: 'gupta@gmail.com',
                password: 'password123',
            };

            // Act
            await request(app).post('/auth/register').send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0]).toMatchObject(userData);
            expect(users[0].firstName).toBe('Harshita');
            expect(users[0].lastName).toBe('Gupta');
            expect(users[0].email).toBe('gupta@gmail.com');
        });

        it('should return an id of the created user', async () => {
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: 'guptaharshita20@gmail.com',
                password: 'password231',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            expect(response.body).toHaveProperty('id');
        });
    });

    // Sad path tests

    describe.skip('Fields are missing', () => {
        it('should return 400 status code', async () => {
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: 'gupta@gmail.com',
                // password is missing
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(400);
            // expect(response.body).toEqual({
            //     error: 'Password is required'
            // });
        });
    });
});
