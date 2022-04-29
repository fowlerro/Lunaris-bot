import express from 'express';
import { isAuthenticated } from '../../utils/middlewares';
import { getGlobalEmojisController } from './controllers/index.controller';

const router = express.Router();

router.get('/', isAuthenticated, getGlobalEmojisController);

export default router;
