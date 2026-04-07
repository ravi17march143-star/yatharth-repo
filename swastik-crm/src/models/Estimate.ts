import mongoose, { Schema, Document } from 'mongoose';

export interface IEstimate extends Document {
  client: mongoose.Types.ObjectId;
  deleted_customer_name: string;
  number: number;
  prefix: string;
  number_format: number;
  date: Date;
  expirydate: Date | null;
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
  invoiceid: mongoose.Types.ObjectId | null;
  invoice_date: Date | null;
  project: mongoose.Types.ObjectId | null;
  pipeline_order: number;
  pipeline_stage: number;
  acceptance_firstname: string;
  acceptance_lastname: string;
  acceptance_email: string;
  acceptance_date: Date | null;
  acceptance_ip: string;
  signature: string;
  short_link: string;
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
  show_shipping_on_estimate: number;
  show_quantity_as: number;
  hash: string;
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
}

const EstimateSchema = new Schema<IEstimate>(
  {
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    deleted_customer_name: { type: String, default: '' },
    number: { type: Number, required: true },
    prefix: { type: String, default: 'EST' },
    number_format: { type: Number, default: 1 },
    date: { type: Date, required: true },
    expirydate: { type: Date, default: null },
    currency: { type: Number, default: 1 },
    subtotal: { type: Number, default: 0 },
    total_tax: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
    adjustment: { type: Number, default: 0 },
    addedfrom: { type: Schema.Types.ObjectId, ref: 'Staff' },
    // Status: 1=Draft, 2=Sent, 3=Declined, 4=Accepted, 5=Expired
    status: { type: Number, default: 1 },
    clientnote: { type: String, default: '' },
    adminnote: { type: String, default: '' },
    discount_percent: { type: Number, default: 0 },
    discount_total: { type: Number, default: 0 },
    discount_type: { type: String, default: '' },
    invoiceid: { type: Schema.Types.ObjectId, ref: 'Invoice', default: null },
    invoice_date: { type: Date, default: null },
    project: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    pipeline_order: { type: Number, default: 0 },
    pipeline_stage: { type: Number, default: 0 },
    acceptance_firstname: { type: String, default: '' },
    acceptance_lastname: { type: String, default: '' },
    acceptance_email: { type: String, default: '' },
    acceptance_date: { type: Date, default: null },
    acceptance_ip: { type: String, default: '' },
    signature: { type: String, default: null },
    short_link: { type: String, default: null },
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
    show_shipping_on_estimate: { type: Number, default: 0 },
    show_quantity_as: { type: Number, default: 1 },
    hash: { type: String },
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
  },
  { timestamps: true }
);

export default mongoose.models.Estimate || mongoose.model<IEstimate>('Estimate', EstimateSchema);
