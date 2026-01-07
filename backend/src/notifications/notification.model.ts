// models/Notification.ts
import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  type: { type: String, enum: ['order_status', 'promo', 'system'], default: 'order_status' },
  link: { type: String },
  createDate: {type: Date}
}, { timestamps: true });

export const Notification = mongoose.model('Notification', NotificationSchema);