import express from 'express';
import {
  createVendor,
  getAllVendors,
  getVendorById,
  updateVendor,
  deleteVendor,
  addTransactionToVendor,
  getVendorTransactionHistory,
  removeTransactionFromVendor,
  updateTransactionInVendor
} from '../controllers/vendorController.js';
import adminCheck from '../middleware/adminCheck.js';
import managerCheck from '../middleware/managerCheck.js';

const router = express.Router();

router.post('/create-vendor', adminCheck, createVendor);
router.get('/get-all-vendors', managerCheck, getAllVendors);
router.get('/get-vendor/:id', managerCheck, getVendorById);
router.put('/update-vendor/:id', adminCheck, updateVendor);
router.delete('/remove-vendor/:id', adminCheck, deleteVendor);

router.post('/add-transaction', adminCheck, addTransactionToVendor);
router.get('/:id/get-transaction-history', managerCheck, getVendorTransactionHistory);
router.patch('/:vendorId/update-transaction/:transactionId', adminCheck, updateTransactionInVendor);
router.delete('/:vendorId/remove-transaction/:transactionId', adminCheck, removeTransactionFromVendor);

export default router;
