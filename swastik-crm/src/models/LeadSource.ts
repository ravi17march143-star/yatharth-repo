import mongoose, { Schema, Document } from 'mongoose';

export interface ILeadSource extends Document {
  name: string;
}

const LeadSourceSchema = new Schema<ILeadSource>(
  { name: { type: String, required: true } },
  { timestamps: true }
);

export default mongoose.models.LeadSource || mongoose.model<ILeadSource>('LeadSource', LeadSourceSchema);
