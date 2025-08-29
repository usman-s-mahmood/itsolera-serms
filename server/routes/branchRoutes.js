import express from 'express';
import { addUserToBranch, createBranch, deleteBranch, editBranch, getBranchInfo, listBranches, testing } from '../controllers/branchController.js';
import adminCheck from '../middleware/adminCheck.js';


const router = express.Router();

router.get(
    '/testing',
    testing
);

router.post(
    '/create-branch',
    adminCheck,
    createBranch
);

router.post(
    '/edit-branch',
    adminCheck,
    editBranch
);

router.post(
    '/delete-branch',
    adminCheck,
    deleteBranch
);

router.get(
    '/get-branch-info',
    getBranchInfo
);

router.post(
    '/add-user-to-branch',
    adminCheck,
    addUserToBranch
);

router.get(
    '/list-branches',
    adminCheck,
    listBranches
);

export default router;