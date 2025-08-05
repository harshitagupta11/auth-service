import express from 'express';
import { TenanatController } from '../controller/TenantController';
import { AppDataSource } from '../config/data-source';
import { Tenant } from '../entity/Tenants';
import { TenanatService } from '../services/tenantService';
import logger from '../config/logger';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
// import logger from '../config/logger';

const router = express.Router();
const tenantRepository = AppDataSource.getRepository(Tenant);
const tenantService = new TenanatService(tenantRepository);
const tenanatController = new TenanatController(tenantService, logger);

router.post('/', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    tenanatController.create(req, res, next),
);

export default router;
