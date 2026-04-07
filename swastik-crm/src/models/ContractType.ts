import mongoose, { Schema, Document } from 'mongoose';

export interface IContractType extends Document {
  name: string;
}

const ContractTypeSchema = new Schema<IContractType>(
  { name: { type: String, required: true } },
  { timestamps: true }
);

export default mongoose.models.ContractType || mongoose.model<IContractType>('ContractType', ContractTypeSchema);
