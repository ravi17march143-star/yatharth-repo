import mongoose, { Schema, Document } from 'mongoose';
export interface INotification extends Document { touserid: mongoose.Types.ObjectId; fromcompany: number; fromuserid: mongoose.Types.ObjectId | null; description: string; isread: number; link: string; additional_data: string; date: Date; }
const NotificationSchema = new Schema<INotification>({ touserid: { type: Schema.Types.ObjectId, ref: 'Staff', required: true }, fromcompany: { type: Number, default: 0 }, fromuserid: { type: Schema.Types.ObjectId, ref: 'Staff', default: null }, description: { type: String, required: true }, isread: { type: Number, default: 0 }, link: { type: String, default: '' }, additional_data: { type: String, default: '' }, date: { type: Date, default: Date.now } }, { timestamps: true });
NotificationSchema.index({ touserid: 1, isread: 1 });
export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
