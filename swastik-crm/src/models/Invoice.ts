import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  description: string;
  long_description: string;
  qty: number;
  rate: number;
  unit: string;
  taxname: string[];
  taxrate: number[];
  order: number;
}

export interface IInvoice extends Document {
  client: mongoose.Types.ObjectId;
  deleted_customer_name: string;
  number: number;
  prefix: string;
  number_format: number;
  datecreated: Date;
  date: Date;
  duedate: Date;
  currency: number;
  subtotal: number;
  total_tax: number;
  total: number;
  adjustment: number;
  addedfrom: mongoose.Types.ObjectId;
  status: number;
  clientnote: string;
  adminnote: string;
  last_overdue_reminder: Date | null;
  last_overdue_reminder2: Date | null;
  last_overdue_reminder3: Date | null;
  cancel_overdue_reminders: number;
  allowed_payment_modes: string[];
  token: string;
  discount_percent: number;
  discount_total: number;
  discount_type: string;
  recurring: number;
  recurring_type: string;
  custom_recurring: number;
  cycles: number;
  total_cycles: number;
  is_recurring_from: mongoose.Types.ObjectId | null;
  last_recurring_date: Date | null;
  terms: string;
  sale_agent: mongoose.Types.ObjectId | null;
  billing_street: string;
  billing_city: string;
  billing_state: string;
  billing_zip: string;
  billing_country: number;
  shipping_street: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: number;
  include_shipping: number;
  show_shipping_on_invoice: number;
  show_quantity_as: number;
  hash: string;
  project: mongoose.Types.ObjectId | null;
  subscription: mongoose.Types.ObjectId | null;
  tags: string[];
  items: IInvoiceItem[];
}

const InvoiceItemSchema = new Schema<IInvoiceItem>({
  description: { type: String, required: true },
  long_description: { type: String, default: '' },
  qty: { type: Number, required: true, default: 1 },
  rate: { type: Number, required: true, default: 0 },
  unit: { type: String, default: '' },
  taxname: [{ type: String }],
  taxrate: [{ type: Number }],
  order: { type: Number, default: 0 },
});

const InvoiceSchema = new Schema<IInvoice>(
  {
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    deleted_customer_name: { type: String, default: '' },
    number: { type: Number, required: true },
    prefix: { type: String, default: 'INV' },
    number_format: { type: Number, default: 1 },
    datecreated: { type: Date, default: Date.now },
    date: { type: Date, required: true },
    duedate: { type: Date, default: null },
    currency: { type: Number, default: 1 },
    subtotal: { type: Number, default: 0 },
    total_tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    adjustment: { type: Number, default: 0 },
    addedfrom: { type: Schema.Types.ObjectId, ref: 'Staff' },
    // Status: 1=Unpaid, 2=Paid, 3=Partially Paid, 4=Overdue, 5=Cancelled, 6=Draft
    status: { type: Number, default: 6 },
    clientnote: { type: String, default: '' },
    adminnote: { type: String, default: '' },
    last_overdue_reminder: { type: Date, default: null },
    last_overdue_reminder2: { type: Date, default: null },
    last_overdue_reminder3: { type: Date, default: null },
    cancel_overdue_reminders: { type: Number, default: 0 },
    allowed_payment_modes: [{ type: String }],
    token: { type: String },
    discount_percent: { type: Number, default: 0 },
    discount_total: { type: Number, default: 0 },
    discount_type: { type: String, default: '' },
    recurring: { type: Number, default: 0 },
    recurring_type: { type: String, default: null },
    custom_recurring: { type: Number, default: 0 },
    cycles: { type: Number, default: 0 },
    total_cycles: { type: Number, default: 0 },
    is_recurring_from: { type: Schema.Types.ObjectId, ref: 'Invoice', default: null },
    last_recurring_date: { type: Date, default: null },
    terms: { type: String, default: '' },
    sale_agent: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    billing_street: { type: String, default: '' },
    billing_city: { type: String, default: '' },
    billing_state: { type: String, default: '' },
    billing_zip: { type: String, default: '' },
    billing_country: { type: Number, default: 0 },
    shipping_street: { type: String, default: '' },
    shipping_city: { type: String, default: '' },
    shipping_state: { type: String, default: '' },
    shipping_zip: { type: String, default: '' },
    shipping_country: { type: Number, default: 0 },
    include_shipping: { type: Number, default: 0 },
    show_shipping_on_invoice: { type: Number, default: 0 },
    show_quantity_as: { type: Number, default: 1 },
    hash: { type: String },
    project: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    subscription: { type: Schema.Types.ObjectId, ref: 'Subscription', default: null },
    tags: [{ type: String }],
    items: [InvoiceItemSchema],
  },
  { timestamps: true }
);

InvoiceSchema.index({ client: 1, status: 1 });
InvoiceSchema.index({ number: 1, prefix: 1 });
InvoiceSchema.index({ duedate: 1, status: 1 });

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
