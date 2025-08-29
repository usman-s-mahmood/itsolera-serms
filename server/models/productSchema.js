import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  SKU: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  barcode: { type: String, unique: true, sparse: true },
  category: { type: String },
  reorderLevel: { type: Number, default: 0 },
  expiryDate: { type: Date },
  price: { type: Number, required: true }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
