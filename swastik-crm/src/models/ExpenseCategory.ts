import mongoose, { Schema, Document } from 'mongoose';

export interface IExpenseCategory extends Document {
  name: string;
  description: string;
}

const ExpenseCategorySchema = new Schema<IExpenseCategory>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.ExpenseCategory || mongoose.model<IExpenseCategory>('ExpenseCategory', ExpenseCategorySchema);
