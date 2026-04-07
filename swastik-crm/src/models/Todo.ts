import mongoose, { Schema, Document } from 'mongoose';

export interface ITodo extends Document {
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  staff: mongoose.Types.ObjectId;
  due_date?: Date;
  createdAt: Date;
}

const TodoSchema = new Schema<ITodo>({
  description: { type: String, required: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  staff: { type: Schema.Types.ObjectId, ref: 'Staff' },
  due_date: { type: Date },
}, { timestamps: true });

export default mongoose.models.Todo || mongoose.model<ITodo>('Todo', TodoSchema);
