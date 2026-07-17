export function replaceStatic(model: unknown, key: string, value: unknown): () => void {
  const target = model as Record<string, unknown>;
  const original = target[key];
  target[key] = value;
  return () => {
    target[key] = original;
  };
}

export function sortedResult<T>(rows: T[]): { sort: () => Promise<T[]> } {
  return {
    sort: async () => rows,
  };
}

export async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

export function restoreAll(restores: Array<() => void>): void {
  for (const restore of restores.reverse()) {
    restore();
  }
}
