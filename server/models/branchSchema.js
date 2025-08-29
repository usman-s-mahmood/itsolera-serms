import mongoose from 'mongoose';

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, index: true },
  address: { type: String },
  contactNumber: { type: String },
  email: { type: String },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',         
    required: true
  },
}, { timestamps: true });

const Branch = mongoose.model('Branch', branchSchema);
export default Branch;
