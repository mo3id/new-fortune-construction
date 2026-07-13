import mongoose, { Document, Schema } from 'mongoose';

export interface IPageContent extends Document {
  page: string;
  section: string;
  content: Record<string, unknown>;
}

const PageContentSchema = new Schema<IPageContent>({
  page: { type: String, required: true, trim: true },
  section: { type: String, required: true, trim: true },
  content: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

PageContentSchema.index({ page: 1, section: 1 }, { unique: true });

export default mongoose.model<IPageContent>('PageContent', PageContentSchema);
