import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectMember {
  staff: mongoose.Types.ObjectId;
  role: string;
}

export interface IProject extends Document {
  name: string;
  description: string;
  status: number;
  client: mongoose.Types.ObjectId | null;
  billing_type: number;
  total_rate: number;
  estimated_hours: number;
  addedfrom: mongoose.Types.ObjectId;
  start_date: Date;
  deadline: Date | null;
  date_finished: Date | null;
  progress: number;
  progress_from_tasks: number;
  project_cost: number;
  project_rate_per_hour: number;
  estimated_hours2: number;
  settings: {
    view_tasks: number;
    create_tasks: number;
    edit_tasks: number;
    comment_on_tasks: number;
    view_task_comments: number;
    view_task_attachments: number;
    view_task_checklist_items: number;
    upload_on_tasks: number;
    view_gantt: number;
    view_timesheets: number;
    view_activity_log: number;
    view_finance_overview: number;
    upload_files: number;
    open_discussions: number;
    view_milestones: number;
  };
  members: IProjectMember[];
  tags: string[];
}

const ProjectSchema = new Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    // Status: 1=In Progress, 2=On Hold, 3=Cancelled, 4=Finished
    status: { type: Number, default: 1 },
    client: { type: Schema.Types.ObjectId, ref: 'Client', default: null },
    // Billing: 1=Fixed Rate, 2=Project Hours, 3=Task Hours
    billing_type: { type: Number, default: 1 },
    total_rate: { type: Number, default: 0 },
    estimated_hours: { type: Number, default: 0 },
    addedfrom: { type: Schema.Types.ObjectId, ref: 'Staff' },
    start_date: { type: Date, default: Date.now },
    deadline: { type: Date, default: null },
    date_finished: { type: Date, default: null },
    progress: { type: Number, default: 0 },
    progress_from_tasks: { type: Number, default: 1 },
    project_cost: { type: Number, default: 0 },
    project_rate_per_hour: { type: Number, default: 0 },
    estimated_hours2: { type: Number, default: 0 },
    settings: {
      view_tasks: { type: Number, default: 1 },
      create_tasks: { type: Number, default: 0 },
      edit_tasks: { type: Number, default: 0 },
      comment_on_tasks: { type: Number, default: 1 },
      view_task_comments: { type: Number, default: 1 },
      view_task_attachments: { type: Number, default: 1 },
      view_task_checklist_items: { type: Number, default: 1 },
      upload_on_tasks: { type: Number, default: 0 },
      view_gantt: { type: Number, default: 1 },
      view_timesheets: { type: Number, default: 0 },
      view_activity_log: { type: Number, default: 1 },
      view_finance_overview: { type: Number, default: 0 },
      upload_files: { type: Number, default: 0 },
      open_discussions: { type: Number, default: 1 },
      view_milestones: { type: Number, default: 1 },
    },
    members: [
      {
        staff: { type: Schema.Types.ObjectId, ref: 'Staff' },
        role: { type: String, default: 'member' },
      },
    ],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

ProjectSchema.index({ client: 1, status: 1 });
ProjectSchema.index({ name: 'text', description: 'text' });

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);
