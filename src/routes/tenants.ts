import express from 'express';
// import logger from '../config/logger';

const router = express.Router();

router.post('/', (req, res) => res.status(201).json({}));

export default router;
