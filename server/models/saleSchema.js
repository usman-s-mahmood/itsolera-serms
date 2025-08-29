import mongoose from 'mongoose';

const saleItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 }
});

const saleSchema = new mongoose.Schema({
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  items: [saleItemSchema],
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Refunded'], default: 'Pending' },
  saleDate: { type: Date, default: Date.now }
}, { timestamps: true });

saleSchema.index({ branchId: 1 });
saleSchema.index({ customerId: 1 });

const Sale = mongoose.model('Sale', saleSchema);
export default Sale;
