import request from 'supertest';
import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';
import { isJwt } from './utils';
import { RefreshToken } from '../../src/entity/RefreshToken';

describe('POST /auth/register', () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // Clear the database before each test
        // This will ensure that each test starts with a clean slate
        // and does not depend on the state left by previous tests
        await connection.dropDatabase();
        await connection.synchronize();
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

        it('should assign a customer role to the user', async () => {
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: 'guptaharshita20@gmail.com',
                password: 'password231',
            };

            // Act
            await request(app).post('/auth/register').send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty('role');
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });

        it('should store the hashed password in the satabase', async () => {
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: 'guptaharshita@gmail.com',
                password: 'password231',
            };

            // Act
            await request(app).post('/auth/register').send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find({ select: ['password'] });
            expect(users[0]).toHaveProperty('password');
            expect(users[0].password).not.toBe('password231');
            expect(users[0].password).toHaveLength(60);
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it('should return 404 status code, if email is already exists', async () => {
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: 'guptaharshita@gmail.com',
                password: 'password231',
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            const users = await userRepository.find();

            // Assert
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });

        it('should return access token and refresh token inside a cookie', async () => {
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: 'guptaharshita@gmail.com',
                password: 'password231',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            let accessToken = null;
            let refreshToken = null;

            // Assert
            const rawCookies = response.headers['set-cookie'];
            const cookies: string[] = Array.isArray(rawCookies)
                ? rawCookies
                : [];
            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split(';')[0].split('=')[1];
                }
                if (cookie.startsWith('refreshToken=')) {
                    refreshToken = cookie.split(';')[0].split('=')[1];
                }
            });
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });
        it('should store the refresh token in the database', async () => {
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: 'guptaharshita@gmail.com',
                password: 'password231',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            const refreshTokenRepo = connection.getRepository(RefreshToken);
            const tokens = await refreshTokenRepo
                .createQueryBuilder('refreshToken')
                .where('refreshToken.userId= :userId', {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany();
            expect(tokens).toHaveLength(1);
        });
    });

    // Sad path tests

    describe('Fields are missing', () => {
        it('should return 400 status code if email field is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                password: 'password123',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            // Assert
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });

        it('should return 400 status code if firstName field is missing', async () => {
            // Arrange
            const userData = {
                // firstName is missing
                lastName: 'Gupta',
                email: 'gupta@gmail.com',
                password: 'password123',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            // Assert
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });

        it('should return 400 status code if password field is missing', async () => {
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
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            // Assert
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });
    });

    describe('Fields are not in proper format', () => {
        it('should trim the email field', async () => {
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: '  harshit@gupta.com ',
                password: 'password123@',
            };

            // Act
            await request(app).post('/auth/register').send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            const user = users[0];
            expect(user.email).toBe('harshit@gupta.com');
        });

        it('should return 400 status code if email is not a valid email', async () => {
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: 'harshit@guptacom', // not a valid email
                password: 'password123@',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });

        it('should return 400 status code if password length is less than 8 characters', async () => {
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: '  harshit@gupta.com ',
                password: 'passw',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(0);
        });
        it('should return an array of error messages if email is missing', async () => {
            // Arrange
            const userData = {
                firstName: 'Harshita',
                lastName: 'Gupta',
                email: '',
                password: 'passw',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            expect(response.body).toHaveProperty('errors');
            expect(
                (response.body as Record<string, string>).errors.length,
            ).toBeGreaterThan(0);
        });
    });
});
