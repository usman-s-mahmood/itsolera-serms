import express from 'express';
import { login, signup, testing } from '../controllers/authController.js';

const router = express.Router();

router.get(
    '/testing',
    testing
);

router.post(
    '/signup',
    signup
);

router.post(
    '/login',
    login
);

export default router;