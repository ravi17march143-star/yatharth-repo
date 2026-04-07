import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  hash: string;
  company: string;
  name: string;
  phonenumber: string;
  email: string;
  website: string;
  leadorder: number;
  status: mongoose.Types.ObjectId;
  source: mongoose.Types.ObjectId | null;
  addedfrom: mongoose.Types.ObjectId;
  assigned: mongoose.Types.ObjectId | null;
  dateadded: Date;
  lastcontact: Date | null;
  contacted_today: number;
  dateconverted: Date | null;
  lost: number;
  junk: number;
  client: mongoose.Types.ObjectId | null;
  note: string;
  description: string;
  country: number;
  city: string;
  zip: string;
  state: string;
  address: string;
  default_language: string;
  tags: string[];
  kanban_order: number;
  lastStatusChange: Date | null;
  is_imported_from_email_integration: number;
  email_integration_uid: string;
  from_form: number;
  form_id: mongoose.Types.ObjectId | null;
}

const LeadSchema = new Schema<ILead>(
  {
    hash: { type: String },
    company: { type: String, default: '' },
    name: { type: String, required: true },
    phonenumber: { type: String, default: '' },
    email: { type: String, default: '' },
    website: { type: String, default: '' },
    leadorder: { type: Number, default: 0 },
    status: { type: Schema.Types.ObjectId, ref: 'LeadStatus', required: true },
    source: { type: Schema.Types.ObjectId, ref: 'LeadSource', default: null },
    addedfrom: { type: Schema.Types.ObjectId, ref: 'Staff' },
    assigned: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    dateadded: { type: Date, default: Date.now },
    lastcontact: { type: Date, default: null },
    contacted_today: { type: Number, default: 0 },
    dateconverted: { type: Date, default: null },
    lost: { type: Number, default: 0 },
    junk: { type: Number, default: 0 },
    client: { type: Schema.Types.ObjectId, ref: 'Client', default: null },
    note: { type: String, default: '' },
    description: { type: String, default: '' },
    country: { type: Number, default: 0 },
    city: { type: String, default: '' },
    zip: { type: String, default: '' },
    state: { type: String, default: '' },
    address: { type: String, default: '' },
    default_language: { type: String, default: null },
    tags: [{ type: String }],
    kanban_order: { type: Number, default: 0 },
    lastStatusChange: { type: Date, default: null },
    is_imported_from_email_integration: { type: Number, default: 0 },
    email_integration_uid: { type: String, default: '' },
    from_form: { type: Number, default: 0 },
    form_id: { type: Schema.Types.ObjectId, default: null },
  },
  { timestamps: true }
);

LeadSchema.index({ status: 1 });
LeadSchema.index({ assigned: 1 });
LeadSchema.index({ name: 'text', company: 'text', email: 'text' });

export default mongoose.models.Lead || mongoose.model<ILead>('Lead', LeadSchema);
