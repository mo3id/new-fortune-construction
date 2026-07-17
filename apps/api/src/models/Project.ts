import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  category: string;
  status: 'Ongoing' | 'Completed';
  location: string;
  clientName: string;
  projectValue: string;
  budget: string;
  duration: string;
  yearCompleted: string;
  overview: string;
  scopeOfWork: string[];
  technologies: string[];
  challenge: string;
  solution: string;
  result: string;
  coverImage: string;
  galleryImages: string[];
  startDate?: Date;
  endDate?: Date;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  createdAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['Ongoing', 'Completed'], default: 'Ongoing' },
  location: { type: String, required: true },
  clientName: { type: String, default: '' },
  projectValue: { type: String, default: '' },
  budget: { type: String, default: '' },
  duration: { type: String, default: '' },
  yearCompleted: { type: String, default: '' },
  overview: { type: String, default: '' },
  scopeOfWork: [{ type: String }],
  technologies: [{ type: String }],
  challenge: { type: String, default: '' },
  solution: { type: String, default: '' },
  result: { type: String, default: '' },
  coverImage: { type: String, default: '' },
  galleryImages: [{ type: String }],
  startDate: { type: Date },
  endDate: { type: Date },
  coordinates: {
    lat: { type: Number },
    lng: { type: Number },
  },
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
