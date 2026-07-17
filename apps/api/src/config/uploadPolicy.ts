export type UploadCategory = 'image' | 'video' | 'cv';

export interface UploadPolicy {
  category: UploadCategory;
  maxSizeBytes: number;
  extensions: readonly string[];
  mimeTypes: readonly string[];
}

export const uploadPolicies: Record<UploadCategory, UploadPolicy> = {
  image: {
    category: 'image',
    maxSizeBytes: 10 * 1024 * 1024,
    extensions: ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  video: {
    category: 'video',
    maxSizeBytes: 100 * 1024 * 1024,
    extensions: ['.mp4', '.webm', '.mov', '.avi'],
    mimeTypes: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
  },
  cv: {
    category: 'cv',
    maxSizeBytes: 5 * 1024 * 1024,
    extensions: ['.pdf', '.doc', '.docx'],
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  },
};
