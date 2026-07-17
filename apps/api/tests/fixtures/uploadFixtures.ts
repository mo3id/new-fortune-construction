export const uploadFixtureNames = {
  image: 'valid-image.png',
  video: 'valid-video.mp4',
  cv: 'valid-cv.pdf',
} as const;

export function createFixtureBuffer(label: string): Buffer {
  return Buffer.from(`fixture:${label}`);
}
