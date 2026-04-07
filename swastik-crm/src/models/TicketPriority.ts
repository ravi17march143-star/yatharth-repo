import mongoose, { Schema, Document } from 'mongoose';
export interface ITicketPriority extends Document { name: string; color: string; }
const TicketPrioritySchema = new Schema<ITicketPriority>({ name: { type: String, required: true }, color: { type: String, default: '#000' } }, { timestamps: true });
export default mongoose.models.TicketPriority || mongoose.model<ITicketPriority>('TicketPriority', TicketPrioritySchema);
