import mongoose, { Schema, Document } from 'mongoose';
export interface IActivityLog extends Document { description: string; date: Date; staffid: mongoose.Types.ObjectId | null; }
const ActivityLogSchema = new Schema<IActivityLog>({ description: { type: String, required: true }, date: { type: Date, default: Date.now }, staffid: { type: Schema.Types.ObjectId, ref: 'Staff', default: null } }, { timestamps: true });
ActivityLogSchema.index({ date: -1 });
export default mongoose.models.ActivityLog || mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
