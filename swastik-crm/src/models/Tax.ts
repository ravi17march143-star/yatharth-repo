import mongoose, { Schema, Document } from 'mongoose';
export interface ITax extends Document { name: string; taxrate: number; }
const TaxSchema = new Schema<ITax>({ name: { type: String, required: true }, taxrate: { type: Number, required: true } }, { timestamps: true });
export default mongoose.models.Tax || mongoose.model<ITax>('Tax', TaxSchema);
