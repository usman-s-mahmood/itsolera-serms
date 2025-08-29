import mongoose from 'mongoose';

const ledgerSchema = new mongoose.Schema({
  accountType: { type: String, enum: ['Supplier', 'Customer', 'Cash'], required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  transactionType: { type: String, enum: ['Credit', 'Debit'], required: true },
  amount: { type: Number, required: true },
  balance: { type: Number, required: true },
  transactionDate: { type: Date, required: true, default: Date.now },
  remarks: { type: String }
}, { timestamps: true });

ledgerSchema.index({ accountType: 1, referenceId: 1 });

const Ledger = mongoose.model('Ledger', ledgerSchema);
export default Ledger;
