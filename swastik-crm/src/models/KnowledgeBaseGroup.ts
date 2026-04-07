import mongoose, { Schema, Document } from 'mongoose';
export interface IKnowledgeBaseGroup extends Document { name: string; color: string; display_order: number; }
const KnowledgeBaseGroupSchema = new Schema<IKnowledgeBaseGroup>({ name: { type: String, required: true }, color: { type: String, default: '#000' }, display_order: { type: Number, default: 0 } }, { timestamps: true });
export default mongoose.models.KnowledgeBaseGroup || mongoose.model<IKnowledgeBaseGroup>('KnowledgeBaseGroup', KnowledgeBaseGroupSchema);
