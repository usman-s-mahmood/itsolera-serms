import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: { type: String },
  email: { type: String, unique: true, sparse: true },
  address: { type: String },
  loyaltyPoints: { type: Number, default: 0 },
  transactionHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Sale' }]
}, { timestamps: true });

customerSchema.index({ email: 1 });

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;
