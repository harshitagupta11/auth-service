import request from 'supertest';
import app from '../../src/app';

describe('POST /auth/register', () => {
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
