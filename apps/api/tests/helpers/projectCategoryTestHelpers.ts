import jwt from 'jsonwebtoken';

export interface ProjectCategoryRecord {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export function categoryFixture(overrides: Partial<ProjectCategoryRecord> = {}): ProjectCategoryRecord {
  return {
    _id: '507f1f77bcf86cd799439101',
    name: 'Roads',
    slug: 'roads',
    icon: 'Route',
    order: 1,
    isActive: true,
    ...overrides,
  };
}

export function authHeader(adminId = '507f1f77bcf86cd799439011'): Record<string, string> {
  const secret = process.env.JWT_SECRET || 'local-test-secret';
  return {
    Authorization: `Bearer ${jwt.sign({ id: adminId }, secret)}`,
  };
}

export async function jsonRequest<TBody extends object>(
  baseUrl: string,
  path: string,
  method: string,
  body: TBody,
  headers: Record<string, string> = {}
): Promise<Response> {
  return fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: JSON.stringify(body),
  });
}
