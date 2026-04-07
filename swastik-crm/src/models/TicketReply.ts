import mongoose, { Schema, Document } from 'mongoose';

export interface ITicketReply extends Document {
  ticket: mongoose.Types.ObjectId;
  userid: mongoose.Types.ObjectId | null;
  admin: mongoose.Types.ObjectId | null;
  message: string;
  date: Date;
  attachment: string | null;
  email: string;
  name: string;
}

const TicketReplySchema = new Schema<ITicketReply>(
  {
    ticket: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true },
    userid: { type: Schema.Types.ObjectId, ref: 'Client', default: null },
    admin: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now },
    attachment: { type: String, default: null },
    email: { type: String, default: '' },
    name: { type: String, default: '' },
  },
  { timestamps: true }
);

TicketReplySchema.index({ ticket: 1, date: 1 });

export default mongoose.models.TicketReply || mongoose.model<ITicketReply>('TicketReply', TicketReplySchema);
