import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  invoice: mongoose.Types.ObjectId;
  amount: number;
  paymentmethod: mongoose.Types.ObjectId;
  date: Date;
  datecreated: Date;
  transactionid: string;
  note: string;
  paymentmode: string;
  gateway_response: string;
}

const PaymentSchema = new Schema<IPayment>(
  {
    invoice: { type: Schema.Types.ObjectId, ref: 'Invoice', required: true },
    amount: { type: Number, required: true },
    paymentmethod: { type: Schema.Types.ObjectId, ref: 'PaymentMode' },
    date: { type: Date, required: true },
    datecreated: { type: Date, default: Date.now },
    transactionid: { type: String, default: '' },
    note: { type: String, default: '' },
    paymentmode: { type: String, default: '' },
    gateway_response: { type: String, default: '' },
  },
  { timestamps: true }
);

PaymentSchema.index({ invoice: 1 });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);
