import mongoose, { Schema, Document } from 'mongoose';
export interface IDepartment extends Document { name: string; color: string; hide_from_client: number; }
const DepartmentSchema = new Schema<IDepartment>({ name: { type: String, required: true }, color: { type: String, default: '#000000' }, hide_from_client: { type: Number, default: 0 } }, { timestamps: true });
export default mongoose.models.Department || mongoose.model<IDepartment>('Department', DepartmentSchema);
