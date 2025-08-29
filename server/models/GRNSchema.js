import mongoose from 'mongoose';

const grnItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantityReceived: { type: Number, required: true, min: 1 }
});

const grnSchema = new mongoose.Schema({
  purchaseOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder', required: true },
  receivedItems: [grnItemSchema],
  receivedDate: { type: Date, default: Date.now }
}, { timestamps: true });

grnSchema.index({ purchaseOrderId: 1 });

const GRN = mongoose.model('GRN', grnSchema);
export default GRN;
