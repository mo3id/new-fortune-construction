import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectCategory extends Document {
  name: string;
  slug: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
}

const ProjectCategorySchema = new Schema<IProjectCategory>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  icon: { type: String, default: 'Layers3' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IProjectCategory>('ProjectCategory', ProjectCategorySchema);
