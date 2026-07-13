import mongoose, { Document, Schema } from 'mongoose';

export interface IJobPosition extends Document {
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  isActive: boolean;
}

const JobPositionSchema = new Schema<IJobPosition>({
  title: { type: String, required: true, trim: true },
  location: { type: String, required: true },
  type: { type: String, required: true, default: 'Full-time' },
  description: { type: String, required: true },
  requirements: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IJobPosition>('JobPosition', JobPositionSchema);
