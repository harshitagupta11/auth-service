import { NextFunction, Response, Request } from 'express';
import { TenanatService } from '../services/tenantService';
import { TenanatRequestBody } from '../types.ts';
import { Logger } from 'winston';
import createHttpError from 'http-errors';

export class TenanatController {
    constructor(
        private tenantService: TenanatService,
        private logger: Logger,
    ) {}

    async create(req: TenanatRequestBody, res: Response, next: NextFunction) {
        const { name, address } = req.body;
        this.logger.debug('Request for creating a tenant', req.body);
        try {
            const tenant = await this.tenantService.create({ name, address });
            this.logger.info('tenant has been created', { id: tenant.id });
            res.status(201).json({ id: tenant.id });
        } catch (err) {
            next(err);
            return;
        }
    }

    async update(req: TenanatRequestBody, res: Response, next: NextFunction) {
        const { name, address } = req.body;
        const tenantId = req.params.id;
        if (isNaN(Number(tenantId))) {
            const err = createHttpError(400, 'Invalid request param');
            next(err);
            return;
        }
        this.logger.debug('Request for creating a tenant', req.body);
        try {
            await this.tenantService.update(Number(tenantId), {
                name,
                address,
            });
            this.logger.info('tenant has been created', { id: tenantId });
            res.status(201).json({ id: Number(tenantId) });
        } catch (err) {
            next(err);
            return;
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantService.getAll();
            this.logger.info('All tenants have been fetched');
            res.json(tenants);
        } catch (err) {
            next(err);
            return;
        }
    }
    async get(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.id;
        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }
        try {
            const tenant = await this.tenantService.getById(Number(tenantId));
            if (!tenant) {
                next(createHttpError(400, 'tenant id doesnot exist'));
            }
            this.logger.info('Requested tenant have been fetched');
            res.json(tenant);
        } catch (err) {
            next(err);
            return;
        }
    }
    async destory(req: Request, res: Response, next: NextFunction) {
        const tenantId = req.params.id;
        if (isNaN(Number(tenantId))) {
            next(createHttpError(400, 'Invalid url param.'));
            return;
        }
        try {
            await this.tenantService.deleteById(Number(tenantId));
            this.logger.info('Tenant has been deleted');
            res.json({ id: tenantId });
        } catch (err) {
            next(err);
            return;
        }
    }
}
