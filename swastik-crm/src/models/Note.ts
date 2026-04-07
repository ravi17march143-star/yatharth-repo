import mongoose, { Schema, Document } from 'mongoose';
export interface INote extends Document { rel_id: mongoose.Types.ObjectId; rel_type: string; description: string; dateadded: Date; addedfrom: mongoose.Types.ObjectId; }
const NoteSchema = new Schema<INote>({ rel_id: { type: Schema.Types.ObjectId, required: true }, rel_type: { type: String, required: true }, description: { type: String, required: true }, dateadded: { type: Date, default: Date.now }, addedfrom: { type: Schema.Types.ObjectId, ref: 'Staff' } }, { timestamps: true });
NoteSchema.index({ rel_id: 1, rel_type: 1 });
export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);
