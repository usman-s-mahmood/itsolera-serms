import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  referenceType: { type: String, enum: ['Sale', 'PurchaseOrder'], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'referenceType' },
  amount: { type: Number, required: true, min: 0 },
  paymentMethod: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' }
}, { timestamps: true });

paymentSchema.index({ referenceType: 1, referenceId: 1 });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
