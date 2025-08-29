import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, index: true },
  description: { type: String },
  discountPercent: { type: Number, required: true, min: 0, max: 100 },
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  usageLimit: { type: Number, default: 0 },
  timesUsed: { type: Number, default: 0 },
  applicableCategories: [{ type: String }]
}, { timestamps: true });

discountSchema.index({ code: 1 });

const Discount = mongoose.model('Discount', discountSchema);
export default Discount;
