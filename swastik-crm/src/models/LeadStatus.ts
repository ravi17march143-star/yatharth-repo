import mongoose, { Schema, Document } from 'mongoose';

export interface ILeadStatus extends Document {
  name: string;
  color: string;
  order: number;
}

const LeadStatusSchema = new Schema<ILeadStatus>(
  {
    name: { type: String, required: true },
    color: { type: String, default: '#000000' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.LeadStatus || mongoose.model<ILeadStatus>('LeadStatus', LeadStatusSchema);
