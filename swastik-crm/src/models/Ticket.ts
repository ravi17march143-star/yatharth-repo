import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket extends Document {
  userid: mongoose.Types.ObjectId;
  contactid: mongoose.Types.ObjectId | null;
  merged_ticket_id: mongoose.Types.ObjectId | null;
  email: string;
  name: string;
  department: mongoose.Types.ObjectId | null;
  priority: mongoose.Types.ObjectId;
  status: mongoose.Types.ObjectId;
  service: string;
  ticketkey: string;
  subject: string;
  message: string;
  admin: mongoose.Types.ObjectId | null;
  date: Date;
  project: mongoose.Types.ObjectId | null;
  lastreply: Date | null;
  clientread: number;
  adminread: number;
  assigned: mongoose.Types.ObjectId | null;
  addedfrom: mongoose.Types.ObjectId | null;
  tags: string[];
  cc: string;
  replies: Array<{
    userid: mongoose.Types.ObjectId | null;
    admin: mongoose.Types.ObjectId | null;
    message: string;
    date: Date;
    attachment: string | null;
    email: string;
    name: string;
  }>;
}

const TicketSchema = new Schema<ITicket>(
  {
    userid: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
    contactid: { type: Schema.Types.ObjectId, ref: 'Contact', default: null },
    merged_ticket_id: { type: Schema.Types.ObjectId, ref: 'Ticket', default: null },
    email: { type: String, default: '' },
    name: { type: String, default: '' },
    department: { type: Schema.Types.ObjectId, ref: 'Department', default: null },
    priority: { type: Schema.Types.ObjectId, ref: 'TicketPriority', required: true },
    status: { type: Schema.Types.ObjectId, ref: 'TicketStatus', required: true },
    service: { type: String, default: '' },
    ticketkey: { type: String, unique: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    admin: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    date: { type: Date, default: Date.now },
    project: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    lastreply: { type: Date, default: null },
    clientread: { type: Number, default: 0 },
    adminread: { type: Number, default: 1 },
    assigned: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    addedfrom: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
    tags: [{ type: String }],
    cc: { type: String, default: '' },
    replies: [
      {
        userid: { type: Schema.Types.ObjectId, ref: 'Client', default: null },
        admin: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
        message: { type: String, required: true },
        date: { type: Date, default: Date.now },
        attachment: { type: String, default: null },
        email: { type: String, default: '' },
        name: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

TicketSchema.index({ userid: 1, status: 1 });

export default mongoose.models.Ticket || mongoose.model<ITicket>('Ticket', TicketSchema);
