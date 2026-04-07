import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  client: mongoose.Types.ObjectId;
  is_primary: number;
  firstname: string;
  lastname: string;
  email: string;
  phonenumber: string;
  title: string;
  datecreated: Date;
  password: string;
  new_pass_key: string | null;
  new_pass_key_requested: Date | null;
  email_verified_at: Date | null;
  email_verification_key: string | null;
  email_verification_sent_at: Date | null;
  last_ip: string;
  last_login: Date | null;
  last_password_change: Date | null;
  active: number;
  profile_image: string | null;
  direction: string | null;
  invoice_emails: number;
  estimate_emails: number;
  credit_note_emails: number;
  contract_emails: number;
  task_emails: number;
  project_emails: number;
  ticket_emails: number;
  permissions: number[];
}

const ContactSchema = new Schema<IContact>(
  {
    client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    is_primary: { type: Number, default: 1 },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phonenumber: { type: String, default: '' },
    title: { type: String, default: '' },
    datecreated: { type: Date, default: Date.now },
    password: { type: String, select: false },
    new_pass_key: { type: String, default: null },
    new_pass_key_requested: { type: Date, default: null },
    email_verified_at: { type: Date, default: null },
    email_verification_key: { type: String, default: null },
    email_verification_sent_at: { type: Date, default: null },
    last_ip: { type: String, default: null },
    last_login: { type: Date, default: null },
    last_password_change: { type: Date, default: null },
    active: { type: Number, default: 1 },
    profile_image: { type: String, default: null },
    direction: { type: String, default: null },
    invoice_emails: { type: Number, default: 1 },
    estimate_emails: { type: Number, default: 1 },
    credit_note_emails: { type: Number, default: 1 },
    contract_emails: { type: Number, default: 1 },
    task_emails: { type: Number, default: 1 },
    project_emails: { type: Number, default: 1 },
    ticket_emails: { type: Number, default: 1 },
    permissions: [{ type: Number }],
  },
  { timestamps: true }
);

ContactSchema.index({ client: 1 });
ContactSchema.index({ email: 1 });

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
