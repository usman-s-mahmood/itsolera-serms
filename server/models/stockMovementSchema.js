import mongoose from 'mongoose';

const stockMovementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  quantity: { type: Number, required: true },
  movementType: { type: String, enum: ['In', 'Out', 'Return', 'Damage'], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movementDate: { type: Date, default: Date.now },
  remarks: { type: String }
}, { timestamps: true });

stockMovementSchema.index({ productId: 1, branchId: 1, movementDate: -1 });

const StockMovement = mongoose.model('StockMovement', stockMovementSchema);
export default StockMovement;
