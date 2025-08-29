import mongoose from 'mongoose';

const purchaseOrderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 }
});

const purchaseOrderSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  items: [purchaseOrderItemSchema],
  status: { type: String, enum: ['Pending', 'Received', 'Canceled'], default: 'Pending' },
  orderDate: { type: Date, default: Date.now },
  expectedDeliveryDate: { type: Date }
}, { timestamps: true });

purchaseOrderSchema.index({ vendorId: 1 });
purchaseOrderSchema.index({ branchId: 1 });

const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
export default PurchaseOrder;
