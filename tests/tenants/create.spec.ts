import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import request from 'supertest';
import app from '../../src/app';
import { Tenant } from '../../src/entity/Tenants';
import createJWKSMock from 'mock-jwks';
import { Roles } from '../../src/constants';

describe('POST /tenants', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string;

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5555');
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
        jwks.start();
        adminToken = jwks.token({
            sub: '1',
            role: Roles.ADMIN,
        });
    });
    afterEach(() => {
        jwks.stop();
    });
    afterAll(async () => {
        await connection.destroy();
    });

    describe('Given all fields', () => {
        it('should return 201 status code', async () => {
            // Arrange
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenanat address',
            };
            // Act
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);

            // Assert
            expect(response.statusCode).toBe(201);
        });

        it('should create a tenant in the database', async () => {
            // Arrange
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenanat address',
            };
            // Act
            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(tenantData);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            // Assert
            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData.name);
            expect(tenants[0].address).toBe(tenantData.address);
        });
        it('should return status code 401 if user is not authenticated', async () => {
            // Arrange
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenanat address',
            };
            // Act
            const response = await request(app)
                .post('/tenants')
                .send(tenantData);

            expect(response.statusCode).toBe(401);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            // Assert
            expect(tenants).toHaveLength(0);
        });
        it('should return status code 403 if user is not admin', async () => {
            // Arrange
            const tenantData = {
                name: 'Tenant name',
                address: 'Tenanat address',
            };
            const managerToken = jwks.token({
                sub: '1',
                role: Roles.MANAGER,
            });
            // Act
            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${managerToken}`])
                .send(tenantData);

            expect(response.statusCode).toBe(403);

            const tenantRepository = connection.getRepository(Tenant);
            const tenants = await tenantRepository.find();

            // Assert
            expect(tenants).toHaveLength(0);
        });
    });
});
