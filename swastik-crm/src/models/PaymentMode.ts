import mongoose, { Schema, Document } from 'mongoose';

export interface IPaymentMode extends Document {
  name: string;
  description: string;
  active: boolean;
  invoices: boolean;
  expenses: boolean;
}

const PaymentModeSchema = new Schema<IPaymentMode>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    active: { type: Boolean, default: true },
    invoices: { type: Boolean, default: true },
    expenses: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.PaymentMode || mongoose.model<IPaymentMode>('PaymentMode', PaymentModeSchema);
