import express from 'express';
import logger from '../config/logger';
import authenticate from '../middlewares/authenticate';
import { canAccess } from '../middlewares/canAccess';
import { Roles } from '../constants';
import { UserController } from '../controller/UserController';
import { UserService } from '../services/userService';
import { AppDataSource } from '../config/data-source';
import { User } from '../entity/User';

const router = express.Router();

// const tenantService = new TenanatService(tenantRepository);
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const userController = new UserController(userService, logger);

router.post('/', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.create(req, res, next),
);
router.patch('/:id', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.update(req, res, next),
);

router.get('/', authenticate, canAccess([Roles.ADMIN]), (req, res, next) =>
    userController.getAll(req, res, next),
);

export default router;
