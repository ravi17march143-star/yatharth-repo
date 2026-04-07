import mongoose, { Schema, Document } from 'mongoose';
export interface IItem extends Document { description: string; long_description: string; rate: number; tax: mongoose.Types.ObjectId | null; tax2: mongoose.Types.ObjectId | null; unit: string; group: mongoose.Types.ObjectId | null; }
const ItemSchema = new Schema<IItem>({ description: { type: String, required: true }, long_description: { type: String, default: '' }, rate: { type: Number, default: 0 }, tax: { type: Schema.Types.ObjectId, ref: 'Tax', default: null }, tax2: { type: Schema.Types.ObjectId, ref: 'Tax', default: null }, unit: { type: String, default: '' }, group: { type: Schema.Types.ObjectId, default: null } }, { timestamps: true });
export default mongoose.models.Item || mongoose.model<IItem>('Item', ItemSchema);
