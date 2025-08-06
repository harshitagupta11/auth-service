import express, { NextFunction, Request, Response } from 'express';
import { TenanatController } from '../controller/TenantController';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenants';
import { TenanatService } from '../services/tenantService';
import logger from '../config/logger';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import tenantValidator from '../validators/tenant-validator';
// import logger from '../config/logger';

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenanatService(tenantRepository);
const tenanatController = new TenanatController(tenantService, logger);

router.post(
    '/',
    authenticate,
    tenantValidator,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        tenanatController.create(req, res, next),
);

router.patch(
    '/:id',
    authenticate,
    tenantValidator,
    canAccess([Roles.ADMIN]),
    (req: Request, res: Response, next: NextFunction) =>
        tenanatController.update(req, res, next),
);

router.get('/', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    tenanatController.getAll(req, res, next),
);

router.get('/:id', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    tenanatController.get(req, res, next),
);

router.delete(
    '/:id',
    authenticate,
    canAccess([Roles.ADMIN]),
    (req, res, next) => tenanatController.destory(req, res, next),
);

export default router;
