import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..', '..', '..', '..');

export function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

export function assertContains(source: string, pattern: RegExp, message: string): void {
  if (!pattern.test(source)) {
    throw new Error(message);
  }
}
