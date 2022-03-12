import express from 'express';
import { isAuthenticated } from '../../utils/middlewares';
import { getProfileController } from './index.controller';

const router = express.Router();

router.get('/', isAuthenticated, getProfileController);

export default router;
