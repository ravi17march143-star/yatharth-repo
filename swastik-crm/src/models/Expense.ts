import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  category: mongoose.Types.ObjectId;
  currency: number;
  total: number;
  tax: number;
  tax2: number;
  reference_no: string;
  note: string;
  expense_name: string;
  client: mongoose.Types.ObjectId | null;
  project: mongoose.Types.ObjectId | null;
  billable: number;
  invoice: mongoose.Types.ObjectId | null;
  paymentmode: mongoose.Types.ObjectId | null;
  date: Date;
  recurring: number;
  recurring_type: string;
  repeat_every: number;
  cycles: number;
  total_cycles: number;
  last_recurring_date: Date | null;
  create_invoice_billable: number;
  send_invoice_to_customer: number;
  invoiced: number;
  addedfrom: mongoose.Types.ObjectId;
}

const ExpenseSchema = new Schema<IExpense>(
  {
    category: { type: Schema.Types.ObjectId, ref: 'ExpenseCategory', required: true },
    currency: { type: Number, default: 1 },
    total: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    tax2: { type: Number, default: 0 },
    reference_no: { type: String, default: '' },
    note: { type: String, default: '' },
    expense_name: { type: String, default: '' },
    client: { type: Schema.Types.ObjectId, ref: 'Client', default: null },
    project: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    billable: { type: Number, default: 0 },
    invoice: { type: Schema.Types.ObjectId, ref: 'Invoice', default: null },
    paymentmode: { type: Schema.Types.ObjectId, ref: 'PaymentMode', default: null },
    date: { type: Date, required: true },
    recurring: { type: Number, default: 0 },
    recurring_type: { type: String, default: null },
    repeat_every: { type: Number, default: 0 },
    cycles: { type: Number, default: 0 },
    total_cycles: { type: Number, default: 0 },
    last_recurring_date: { type: Date, default: null },
    create_invoice_billable: { type: Number, default: 0 },
    send_invoice_to_customer: { type: Number, default: 0 },
    invoiced: { type: Number, default: 0 },
    addedfrom: { type: Schema.Types.ObjectId, ref: 'Staff' },
  },
  { timestamps: true }
);

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
