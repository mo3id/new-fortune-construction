import mongoose, { Document, Schema } from 'mongoose';

export interface IJobApplication extends Document {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  coverLetter: string;
  cvFile?: string;
  status: 'new' | 'reviewed' | 'shortlisted' | 'rejected';
  createdAt: Date;
}

const JobApplicationSchema = new Schema<IJobApplication>({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  position: { type: String, required: true },
  coverLetter: { type: String, required: true },
  cvFile: { type: String },
  status: { type: String, enum: ['new', 'reviewed', 'shortlisted', 'rejected'], default: 'new' },
}, { timestamps: true });

export default mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);
