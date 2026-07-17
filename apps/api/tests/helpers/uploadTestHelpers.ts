import jwt from 'jsonwebtoken';

export function authHeader(): string {
  const jwtSecret = process.env.JWT_SECRET || 'local-test-secret';
  return `Bearer ${jwt.sign({ id: '507f1f77bcf86cd799439011' }, jwtSecret)}`;
}

export function filePart(content: string | Buffer, type: string): Blob {
  return new Blob([content], { type });
}

export function oversizedFilePart(bytes: number, type: string): Blob {
  return new Blob([Buffer.alloc(bytes)], { type });
}

export async function postMultipart(baseUrl: string, path: string, form: FormData, token?: string): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: token } : undefined,
    body: form,
  });
}
