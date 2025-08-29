import mongoose from 'mongoose';

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  contactPerson: { type: String },
  contactNumber: { type: String },
  email: { type: String },
  address: { type: String },
  paymentTerms: { type: String },
  transactionHistory: [{
    purchaseOrderId: { type: mongoose.Schema.Types.ObjectId, ref: 'PurchaseOrder' },
    date: { type: Date },
    amount: { type: Number }
  }]
}, { timestamps: true });

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
