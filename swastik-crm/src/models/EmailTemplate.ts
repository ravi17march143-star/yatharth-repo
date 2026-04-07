import mongoose, { Schema, Document } from 'mongoose';
export interface IEmailTemplate extends Document { slug: string; subject: string; message: string; type: string; active: boolean; }
const EmailTemplateSchema = new Schema<IEmailTemplate>({ slug: { type: String, required: true, unique: true }, subject: { type: String, required: true }, message: { type: String, required: true }, type: { type: String, default: 'general' }, active: { type: Boolean, default: true } }, { timestamps: true });
export default mongoose.models.EmailTemplate || mongoose.model<IEmailTemplate>('EmailTemplate', EmailTemplateSchema);
