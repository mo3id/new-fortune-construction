const SENSITIVE_URI_PATTERN = /(mongodb(?:\+srv)?:\/\/)([^/@\s]+@)?([^/\s?]+)([^\s]*)?/gi;
const STANDALONE_CREDENTIAL_PATTERN = /\b[^\s:@/]+:[^\s:@/]+(?=\s|$)/g;

function configuredSecretValues(): string[] {
  return [process.env.JWT_SECRET]
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .sort((a, b) => b.length - a.length);
}

export function redactSensitiveValue(value: unknown): string {
  const raw = value instanceof Error ? value.message : String(value);
  let redacted = raw.replace(SENSITIVE_URI_PATTERN, (_match, protocol, _auth, host) => {
    return `${protocol}<redacted>@${host}/<redacted>`;
  });

  for (const secret of configuredSecretValues()) {
    redacted = redacted.split(secret).join('<redacted-secret>');
  }

  return redacted.replace(STANDALONE_CREDENTIAL_PATTERN, '<redacted-credential>');
}

export function redactClientValue(value: unknown): string {
  return redactSensitiveValue(value)
    .split('\n')
    .filter((line) => !/^\s*at\s+/.test(line))
    .join('\n');
}
