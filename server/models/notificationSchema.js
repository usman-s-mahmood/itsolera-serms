import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: { type: String, enum: ['LowStock', 'Expiry'], required: true },
  relatedEntityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Unread', 'Read'], default: 'Unread' }
}, { timestamps: true });

notificationSchema.index({ type: 1, status: 1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
