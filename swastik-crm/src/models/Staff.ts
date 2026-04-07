import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  active: number;
  admin: number;
  isadmin: number;
  role: mongoose.Types.ObjectId | null;
  department: mongoose.Types.ObjectId | null;
  hourly_rate: number;
  phonenumber: string;
  profile_image: string;
  facebook: string;
  linkedin: string;
  skype: string;
  default_language: string;
  directions: string | null;
  is_not_staff: number;
  two_factor_auth_enabled: number;
  email_signature: string;
  last_ip: string;
  last_login: Date;
  last_activity: Date;
  last_password_change: Date;
  new_pass_key: string | null;
  new_pass_key_requested: Date | null;
  datejoined: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StaffSchema = new Schema<IStaff>(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    active: { type: Number, default: 1 },
    admin: { type: Number, default: 0 },
    isadmin: { type: Number, default: 0 },
    role: { type: Schema.Types.ObjectId, ref: 'Role', default: null },
    department: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    hourly_rate: { type: Number, default: 0 },
    phonenumber: { type: String, default: '' },
    profile_image: { type: String, default: null },
    facebook: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    skype: { type: String, default: '' },
    default_language: { type: String, default: 'english' },
    directions: { type: String, default: null },
    is_not_staff: { type: Number, default: 0 },
    two_factor_auth_enabled: { type: Number, default: 0 },
    email_signature: { type: String, default: '' },
    last_ip: { type: String, default: null },
    last_login: { type: Date, default: null },
    last_activity: { type: Date, default: null },
    last_password_change: { type: Date, default: null },
    new_pass_key: { type: String, default: null },
    new_pass_key_requested: { type: Date, default: null },
    datejoined: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

StaffSchema.virtual('fullname').get(function () {
  return `${this.firstname} ${this.lastname}`;
});

StaffSchema.index({ active: 1 });

export default mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);
