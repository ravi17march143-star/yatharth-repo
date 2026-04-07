import mongoose, { Schema, Document } from 'mongoose';
export interface ITicketStatus extends Document { name: string; color: string; isdefault: number; order: number; }
const TicketStatusSchema = new Schema<ITicketStatus>({ name: { type: String, required: true }, color: { type: String, default: '#000' }, isdefault: { type: Number, default: 0 }, order: { type: Number, default: 0 } }, { timestamps: true });
export default mongoose.models.TicketStatus || mongoose.model<ITicketStatus>('TicketStatus', TicketStatusSchema);
