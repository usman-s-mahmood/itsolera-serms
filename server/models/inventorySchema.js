import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  quantity: { type: Number, required: true, default: 0 },
  expiryDate: { type: Date },
  reorderLevel: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

inventorySchema.index({ productId: 1, branchId: 1 }, { unique: true });

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory;
