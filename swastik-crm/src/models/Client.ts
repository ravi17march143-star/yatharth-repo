import mongoose, { Schema, Document } from 'mongoose';

export interface IClient extends Document {
  company: string;
  vat: string;
  phonenumber: string;
  country: number;
  city: string;
  zip: string;
  state: string;
  address: string;
  website: string;
  datecreated: Date;
  active: number;
  leadid: mongoose.Types.ObjectId | null;
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
  longitude: string;
  latitude: string;
  default_language: string;
  default_currency: number;
  show_primary_contact: number;
  stripe_id: string;
  registration_confirmed: number;
  addedfrom: mongoose.Types.ObjectId | null;
  groups: mongoose.Types.ObjectId[];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ClientSchema = new Schema<IClient>(
  {
    company: { type: String, required: true },
    vat: { type: String, default: null },
    phonenumber: { type: String, default: '' },
    country: { type: Number, default: 0 },
    city: { type: String, default: '' },
    zip: { type: String, default: '' },
    state: { type: String, default: '' },
    address: { type: String, default: '' },
    website: { type: String, default: '' },
    datecreated: { type: Date, default: Date.now },
    active: { type: Number, default: 1 },
    leadid: { type: Schema.Types.ObjectId, ref: 'Lead', default: null },
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
    longitude: { type: String, default: null },
    latitude: { type: String, default: null },
    default_language: { type: String, default: null },
    default_currency: { type: Number, default: 0 },
    show_primary_contact: { type: Number, default: 0 },
    stripe_id: { type: String, default: null },
    registration_confirmed: { type: Number, default: 1 },
    addedfrom: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    groups: [{ type: Schema.Types.ObjectId, ref: 'ClientGroup' }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

ClientSchema.index({ company: 'text' });
ClientSchema.index({ active: 1 });

export default mongoose.models.Client || mongoose.model<IClient>('Client', ClientSchema);
