import mongoose, { Schema, Document } from 'mongoose';
export interface IMilestone extends Document { project: mongoose.Types.ObjectId; name: string; description: string; due_date: Date | null; order: number; color: string; }
const MilestoneSchema = new Schema<IMilestone>({ project: { type: Schema.Types.ObjectId, ref: 'Project', required: true }, name: { type: String, required: true }, description: { type: String, default: '' }, due_date: { type: Date, default: null }, order: { type: Number, default: 0 }, color: { type: String, default: '#000000' } }, { timestamps: true });
export default mongoose.models.Milestone || mongoose.model<IMilestone>('Milestone', MilestoneSchema);
