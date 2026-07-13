import mongoose, { Document, Schema } from 'mongoose';

export interface IService extends Document {
  title: string;
  tagline: string;
  description: string;
  features: string[];
  bgImage: string;
  order: number;
}

const ServiceSchema = new Schema<IService>({
  title: { type: String, required: true, trim: true },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String }],
  bgImage: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<IService>('Service', ServiceSchema);
