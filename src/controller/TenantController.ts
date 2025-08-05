import { NextFunction, Response } from 'express';
import { TenanatService } from '../services/tenantService';
import { TenanatRequestBody } from '../types.ts';
import { Logger } from 'winston';

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
}
