import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember extends Document {
  name: string;
  role: string;
  photo: string;
  bio: string;
  socialLinks: { linkedin?: string; twitter?: string };
  order: number;
}

const TeamMemberSchema = new Schema<ITeamMember>({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true },
  photo: { type: String, default: '' },
  bio: { type: String, default: '' },
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  order: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model<ITeamMember>('TeamMember', TeamMemberSchema);
