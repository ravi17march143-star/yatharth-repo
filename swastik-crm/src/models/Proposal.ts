import mongoose, { Schema, Document } from 'mongoose';

export interface IProposal extends Document {
  subject: string;
  content: string;
  addedfrom: mongoose.Types.ObjectId;
  datecreated: Date;
  total: number;
  subtotal: number;
  total_tax: number;
  adjustment: number;
  discount_percent: number;
  discount_total: number;
  discount_type: string;
  status: number;
  open_till: Date | null;
  date_send: Date | null;
  date_converted: Date | null;
  pipeline_order: number;
  pipeline_stage: number;
  is_expiry_notified: number;
  acceptance_firstname: string;
  acceptance_lastname: string;
  acceptance_email: string;
  acceptance_date: Date | null;
  acceptance_ip: string;
  signature: string | null;
  short_link: string | null;
  hash: string;
  rel_id: mongoose.Types.ObjectId | null;
  rel_type: string;
  client: mongoose.Types.ObjectId | null;
  tags: string[];
  assigned: mongoose.Types.ObjectId | null;
  currency: number;
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
  comments: Array<{
    content: string;
    staffid: mongoose.Types.ObjectId;
    created_at: Date;
  }>;
}

const ProposalSchema = new Schema<IProposal>(
  {
    subject: { type: String, required: true },
    content: { type: String, default: '' },
    addedfrom: { type: Schema.Types.ObjectId, ref: 'Staff' },
    datecreated: { type: Date, default: Date.now },
    total: { type: Number, default: 0 },
    subtotal: { type: Number, default: 0 },
    total_tax: { type: Number, default: 0 },
    adjustment: { type: Number, default: 0 },
    discount_percent: { type: Number, default: 0 },
    discount_total: { type: Number, default: 0 },
    discount_type: { type: String, default: '' },
    // Status: 1=Draft, 2=Sent, 3=Declined, 4=Accepted, 5=Open
    status: { type: Number, default: 1 },
    open_till: { type: Date, default: null },
    date_send: { type: Date, default: null },
    date_converted: { type: Date, default: null },
    pipeline_order: { type: Number, default: 0 },
    pipeline_stage: { type: Number, default: 0 },
    is_expiry_notified: { type: Number, default: 0 },
    acceptance_firstname: { type: String, default: '' },
    acceptance_lastname: { type: String, default: '' },
    acceptance_email: { type: String, default: '' },
    acceptance_date: { type: Date, default: null },
    acceptance_ip: { type: String, default: '' },
    signature: { type: String, default: null },
    short_link: { type: String, default: null },
    hash: { type: String },
    rel_id: { type: Schema.Types.ObjectId, default: null },
    rel_type: { type: String, default: 'customer' },
    client: { type: Schema.Types.ObjectId, ref: 'Client', default: null },
    tags: [{ type: String }],
    assigned: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    currency: { type: Number, default: 1 },
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
    comments: [
      {
        content: { type: String },
        staffid: { type: Schema.Types.ObjectId, ref: 'Staff' },
        created_at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Proposal || mongoose.model<IProposal>('Proposal', ProposalSchema);
