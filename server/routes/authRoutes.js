import express from 'express';
import { deleteUser, editPassword, editUser, login, logout, signup, testing, userInfo } from '../controllers/authController.js';
import tokenCheck from '../middleware/tokenCheck.js';

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

router.post(
    '/edit-user',
    tokenCheck,
    editUser
);

router.post(
    '/edit-password',
    tokenCheck,
    editPassword
);

router.post(
    '/user-info',
    tokenCheck,
    userInfo
);

router.post(
    '/delete-user',
    tokenCheck,
    deleteUser
);

export default router;