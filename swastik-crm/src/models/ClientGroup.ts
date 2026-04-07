import mongoose, { Schema, Document } from 'mongoose';
export interface IClientGroup extends Document { name: string; }
const ClientGroupSchema = new Schema<IClientGroup>({ name: { type: String, required: true } }, { timestamps: true });
export default mongoose.models.ClientGroup || mongoose.model<IClientGroup>('ClientGroup', ClientGroupSchema);
