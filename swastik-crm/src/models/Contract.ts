import mongoose, { Schema, Document } from 'mongoose';

export interface IContract extends Document {
  content: string;
  description: string;
  subject: string;
  client: mongoose.Types.ObjectId;
  datestart: Date;
  dateend: Date | null;
  contract_type: mongoose.Types.ObjectId | null;
  project: mongoose.Types.ObjectId | null;
  addedfrom: mongoose.Types.ObjectId;
  dateadded: Date;
  isexpirynotified: number;
  contract_value: number;
  trash: number;
  not_visible_to_client: number;
  hash: string;
  signed: number;
  signature: string | null;
  marked_as_signed: number;
  acceptance_firstname: string;
  acceptance_lastname: string;
  acceptance_email: string;
  acceptance_date: Date | null;
  acceptance_ip: string;
  short_link: string | null;
  tags: string[];
  comments: Array<{
    content: string;
    staffid: mongoose.Types.ObjectId;
    created_at: Date;
  }>;
  renewals: Array<{
    contract_type: mongoose.Types.ObjectId | null;
    start_date: Date;
    end_date: Date;
    value: number;
    old_value: number;
    renewed_by: mongoose.Types.ObjectId;
    renewed_date: Date;
  }>;
}

const ContractSchema = new Schema<IContract>(
  {
    content: { type: String, default: '' },
    description: { type: String, default: '' },
    subject: { type: String, required: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    datestart: { type: Date, required: true },
    dateend: { type: Date, default: null },
    contract_type: { type: Schema.Types.ObjectId, ref: 'ContractType', default: null },
    project: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    addedfrom: { type: Schema.Types.ObjectId, ref: 'Staff' },
    dateadded: { type: Date, default: Date.now },
    isexpirynotified: { type: Number, default: 0 },
    contract_value: { type: Number, default: null },
    trash: { type: Number, default: 0 },
    not_visible_to_client: { type: Number, default: 0 },
    hash: { type: String },
    signed: { type: Number, default: 0 },
    signature: { type: String, default: null },
    marked_as_signed: { type: Number, default: 0 },
    acceptance_firstname: { type: String, default: '' },
    acceptance_lastname: { type: String, default: '' },
    acceptance_email: { type: String, default: '' },
    acceptance_date: { type: Date, default: null },
    acceptance_ip: { type: String, default: '' },
    short_link: { type: String, default: null },
    tags: [{ type: String }],
    comments: [
      {
        content: { type: String },
        staffid: { type: Schema.Types.ObjectId, ref: 'Staff' },
        created_at: { type: Date, default: Date.now },
      },
    ],
    renewals: [
      {
        contract_type: { type: Schema.Types.ObjectId, ref: 'ContractType', default: null },
        start_date: { type: Date },
        end_date: { type: Date },
        value: { type: Number, default: 0 },
        old_value: { type: Number, default: 0 },
        renewed_by: { type: Schema.Types.ObjectId, ref: 'Staff' },
        renewed_date: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Contract || mongoose.model<IContract>('Contract', ContractSchema);
