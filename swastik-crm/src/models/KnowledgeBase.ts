import mongoose, { Schema, Document } from 'mongoose';

export interface IKnowledgeBase extends Document {
  articlegroup: mongoose.Types.ObjectId;
  active: number;
  article_order: number;
  slug: string;
  title: string;
  description: string;
  staff_article: number;
  dateadded: Date;
  lastmodified: Date;
  views: number;
  thumbs_up: number;
  thumbs_down: number;
  tags: string[];
}

const KnowledgeBaseSchema = new Schema<IKnowledgeBase>(
  {
    articlegroup: { type: Schema.Types.ObjectId, ref: 'KnowledgeBaseGroup', required: true },
    active: { type: Number, default: 1 },
    article_order: { type: Number, default: 0 },
    slug: { type: String, unique: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    staff_article: { type: Number, default: 0 },
    dateadded: { type: Date, default: Date.now },
    lastmodified: { type: Date, default: Date.now },
    views: { type: Number, default: 0 },
    thumbs_up: { type: Number, default: 0 },
    thumbs_down: { type: Number, default: 0 },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

KnowledgeBaseSchema.index({ title: 'text', description: 'text' });

export default mongoose.models.KnowledgeBase || mongoose.model<IKnowledgeBase>('KnowledgeBase', KnowledgeBaseSchema);
