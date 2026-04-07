import mongoose, { Schema, Document } from 'mongoose';
export interface IRole extends Document { name: string; permissions: Record<string, boolean>; isdefault: number; }
const RoleSchema = new Schema<IRole>({ name: { type: String, required: true }, permissions: { type: Schema.Types.Mixed, default: {} }, isdefault: { type: Number, default: 0 } }, { timestamps: true });
export default mongoose.models.Role || mongoose.model<IRole>('Role', RoleSchema);
