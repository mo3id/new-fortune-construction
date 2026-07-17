export interface ProjectRecord {
  _id: string;
  title: string;
  category: string;
  status: 'Ongoing' | 'Completed';
  location: string;
}

export function projectFixture(overrides: Partial<ProjectRecord> = {}): ProjectRecord {
  return {
    _id: '507f1f77bcf86cd799439201',
    title: 'Mzuzu Road Upgrade',
    category: 'Roads',
    status: 'Ongoing',
    location: 'Mzuzu',
    ...overrides,
  };
}
