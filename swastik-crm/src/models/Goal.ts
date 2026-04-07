import mongoose, { Schema, Document } from 'mongoose';

export interface IGoal extends Document {
  name: string;
  goal_type: string;
  start_date: Date;
  end_date: Date;
  target_value: number;
  current_value: number;
  staff_id?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const GoalSchema = new Schema<IGoal>({
  name: { type: String, required: true },
  goal_type: { type: String, required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  target_value: { type: Number, required: true, default: 0 },
  current_value: { type: Number, default: 0 },
  staff_id: { type: Schema.Types.ObjectId, ref: 'Staff' },
}, { timestamps: true });

export default mongoose.models.Goal || mongoose.model<IGoal>('Goal', GoalSchema);
