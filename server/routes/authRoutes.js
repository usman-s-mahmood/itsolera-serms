import express from 'express';
import { login, logout, signup, testing } from '../controllers/authController.js';

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

router.post(
    '/logout',
    logout
);

export default router;