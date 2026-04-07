import mongoose, { Schema, Document } from 'mongoose';

export interface ITaskChecklistItem {
  description: string;
  finished: number;
  finished_from: mongoose.Types.ObjectId | null;
  dateadded: Date;
  addedfrom: mongoose.Types.ObjectId;
  assigned_to: mongoose.Types.ObjectId | null;
}

export interface ITask extends Document {
  name: string;
  description: string;
  priority: number;
  dateadded: Date;
  startdate: Date;
  duedate: Date | null;
  datefinished: Date | null;
  addedfrom: mongoose.Types.ObjectId;
  status: number;
  recurring_type: string;
  repeat_every: number;
  recurring: number;
  is_recurring_from: mongoose.Types.ObjectId | null;
  cycles: number;
  total_cycles: number;
  last_recurring_date: Date | null;
  custom_recurring: number;
  deadline_notified: number;
  project: mongoose.Types.ObjectId | null;
  milestone: mongoose.Types.ObjectId | null;
  kanban_order: number;
  milestone_order: number;
  visible_to_client: number;
  billable: number;
  billed: number;
  invoice: mongoose.Types.ObjectId | null;
  hourly_rate: number;
  rel_type: string;
  rel_id: mongoose.Types.ObjectId | null;
  tags: string[];
  assigned: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
  checklist: ITaskChecklistItem[];
}

const TaskSchema = new Schema<ITask>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    // Priority: 1=Low, 2=Medium, 3=High, 4=Urgent
    priority: { type: Number, default: 2 },
    dateadded: { type: Date, default: Date.now },
    startdate: { type: Date, default: Date.now },
    duedate: { type: Date, default: null },
    datefinished: { type: Date, default: null },
    addedfrom: { type: Schema.Types.ObjectId, ref: 'Staff' },
    // Status: 1=Not Started, 2=In Progress, 3=Testing, 4=Awaiting Feedback, 5=Complete
    status: { type: Number, default: 1 },
    recurring_type: { type: String, default: null },
    repeat_every: { type: Number, default: 0 },
    recurring: { type: Number, default: 0 },
    is_recurring_from: { type: Schema.Types.ObjectId, ref: 'Task', default: null },
    cycles: { type: Number, default: 0 },
    total_cycles: { type: Number, default: 0 },
    last_recurring_date: { type: Date, default: null },
    custom_recurring: { type: Number, default: 0 },
    deadline_notified: { type: Number, default: 0 },
    project: { type: Schema.Types.ObjectId, ref: 'Project', default: null },
    milestone: { type: Schema.Types.ObjectId, ref: 'Milestone', default: null },
    kanban_order: { type: Number, default: 0 },
    milestone_order: { type: Number, default: 0 },
    visible_to_client: { type: Number, default: 0 },
    billable: { type: Number, default: 0 },
    billed: { type: Number, default: 0 },
    invoice: { type: Schema.Types.ObjectId, ref: 'Invoice', default: null },
    hourly_rate: { type: Number, default: 0 },
    rel_type: { type: String, default: null },
    rel_id: { type: Schema.Types.ObjectId, default: null },
    tags: [{ type: String }],
    assigned: [{ type: Schema.Types.ObjectId, ref: 'Staff' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'Staff' }],
    checklist: [
      {
        description: { type: String, required: true },
        finished: { type: Number, default: 0 },
        finished_from: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
        dateadded: { type: Date, default: Date.now },
        addedfrom: { type: Schema.Types.ObjectId, ref: 'Staff' },
        assigned_to: { type: Schema.Types.ObjectId, ref: 'Staff', default: null },
      },
    ],
  },
  { timestamps: true }
);

TaskSchema.index({ project: 1, status: 1 });
TaskSchema.index({ assigned: 1, status: 1 });

export default mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);
