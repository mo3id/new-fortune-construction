import mongoose, { Document, Schema } from 'mongoose';

export interface ISuccessStory extends Document {
  quote: string;
  author: string;
  org: string;
  initials: string;
  image?: string;
  order: number;
}

const SuccessStorySchema = new Schema<ISuccessStory>({
  quote: { type: String, required: true },
  author: { type: String, required: true, trim: true },
  org: { type: String, required: true, trim: true },
  initials: { type: String, required: true, trim: true },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<ISuccessStory>('SuccessStory', SuccessStorySchema);
