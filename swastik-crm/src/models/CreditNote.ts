import mongoose, { Schema, Document } from 'mongoose';

export interface ICreditNote extends Document {
  client: mongoose.Types.ObjectId;
  deleted_customer_name: string;
  number: number;
  prefix: string;
  date: Date;
  currency: number;
  subtotal: number;
  total_tax: number;
  total: number;
  adjustment: number;
  addedfrom: mongoose.Types.ObjectId;
  status: number;
  clientnote: string;
  adminnote: string;
  discount_percent: number;
  discount_total: number;
  discount_type: string;
  reference_no: string;
  hash: string;
  terms: string;
  billing_street: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_country: number;
  tags: string[];
  items: Array<{
    description: string;
    long_description: string;
    qty: number;
    rate: number;
    unit: string;
    taxname: string[];
    taxrate: number[];
    order: number;
  }>;
  refunds: Array<{
    credit_note: mongoose.Types.ObjectId;
    staff: mongoose.Types.ObjectId;
    date: Date;
    amount: number;
    refunded_on_invoice: mongoose.Types.ObjectId | null;
    invoice_payment_record: mongoose.Types.ObjectId | null;
    note: string;
  }>;
}

const CreditNoteSchema = new Schema<ICreditNote>(
  {
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    deleted_customer_name: { type: String, default: '' },
    number: { type: Number, required: true },
    prefix: { type: String, default: 'CN' },
    date: { type: Date, required: true },
    currency: { type: Number, default: 1 },
    subtotal: { type: Number, default: 0 },
    total_tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    adjustment: { type: Number, default: 0 },
    addedfrom: { type: Schema.Types.ObjectId, ref: 'Staff' },
    // Status: 1=Open, 2=Closed/Used
    status: { type: Number, default: 1 },
    clientnote: { type: String, default: '' },
    adminnote: { type: String, default: '' },
    discount_percent: { type: Number, default: 0 },
    discount_total: { type: Number, default: 0 },
    discount_type: { type: String, default: '' },
    reference_no: { type: String, default: '' },
    hash: { type: String },
    terms: { type: String, default: '' },
    billing_street: { type: String, default: '' },
    billing_city: { type: String, default: '' },
    billing_state: { type: String, default: '' },
    billing_zip: { type: String, default: '' },
    billing_country: { type: Number, default: 0 },
    tags: [{ type: String }],
    items: [
      {
        description: { type: String },
        long_description: { type: String, default: '' },
        qty: { type: Number, default: 1 },
        rate: { type: Number, default: 0 },
        unit: { type: String, default: '' },
        taxname: [{ type: String }],
        taxrate: [{ type: Number }],
        order: { type: Number, default: 0 },
      },
    ],
    refunds: [
      {
        credit_note: { type: Schema.Types.ObjectId, ref: 'CreditNote' },
        staff: { type: Schema.Types.ObjectId, ref: 'Staff' },
        date: { type: Date },
        amount: { type: Number, default: 0 },
        refunded_on_invoice: { type: Schema.Types.ObjectId, ref: 'Invoice', default: null },
        invoice_payment_record: { type: Schema.Types.ObjectId, ref: 'Payment', default: null },
        note: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.CreditNote || mongoose.model<ICreditNote>('CreditNote', CreditNoteSchema);
