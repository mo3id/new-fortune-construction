export type RuntimeMode = 'local' | 'development' | 'test' | 'production';

export interface RuntimeConfig {
  port: number;
  nodeEnv: RuntimeMode;
  jwtSecretStatus: 'configured' | 'missing' | 'blank' | 'unsafe';
  jwtExpiresIn: string;
  allowedOrigins: string[];
  uploadLimits: {
    imageBytes: number;
    videoBytes: number;
    cvBytes: number;
  };
  usesRemoteDatabase: boolean;
  allowRemoteDatabase: boolean;
}

const UNSAFE_JWT_SECRETS = new Set(['secret', 'changeme', 'change-me', 'password']);

function parsePort(value: string | undefined): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 3001;
}

function splitOrigins(value: string | undefined): string[] {
  return (value ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function resolveOrigin(env: NodeJS.ProcessEnv, name: 'PUBLIC_SITE_ORIGIN' | 'DASHBOARD_ORIGIN', localFallback: string): string {
  const configured = env[name]?.trim();
  if (configured) return configured;

  if (env.NODE_ENV === 'production') {
    throw new Error(`${name} must be configured for production.`);
  }

  return localFallback;
}

export function getJwtSecretStatus(secret?: string): RuntimeConfig['jwtSecretStatus'] {
  const candidate = arguments.length === 0 ? process.env.JWT_SECRET : secret;
  if (candidate === undefined) return 'missing';
  const trimmed = candidate.trim();
  if (!trimmed) return 'blank';
  if (UNSAFE_JWT_SECRETS.has(trimmed.toLowerCase())) return 'unsafe';
  return 'configured';
}

export function getRequiredJwtSecret(env: NodeJS.ProcessEnv = process.env): string {
  const secret = env.JWT_SECRET;
  if (getJwtSecretStatus(secret) !== 'configured' || !secret) {
    throw new Error('JWT signing secret is not safely configured.');
  }
  return secret;
}

export function isRemoteMongoUri(uri = process.env.MONGODB_URI): boolean {
  if (!uri) return false;
  return !/^mongodb:\/\/(localhost|127\.0\.0\.1|\[::1\])(?::|\/)/i.test(uri);
}

export function allowsRemoteDatabase(env: NodeJS.ProcessEnv = process.env): boolean {
  if (!isRemoteMongoUri(env.MONGODB_URI)) return true;
  if (env.ALLOW_REMOTE_DB === 'true') return true;
  return env.NODE_ENV === 'production';
}

export function loadRuntimeConfig(env: NodeJS.ProcessEnv = process.env): RuntimeConfig {
  const nodeEnv = (env.NODE_ENV || 'local') as RuntimeMode;
  const publicSiteOrigin = resolveOrigin(env, 'PUBLIC_SITE_ORIGIN', 'http://localhost:5173');
  const dashboardOrigin = resolveOrigin(env, 'DASHBOARD_ORIGIN', 'http://localhost:5174');

  return {
    port: parsePort(env.PORT),
    nodeEnv,
    jwtSecretStatus: getJwtSecretStatus(env.JWT_SECRET),
    jwtExpiresIn: env.JWT_EXPIRES_IN || '24h',
    allowedOrigins: [
      publicSiteOrigin,
      dashboardOrigin,
      ...splitOrigins(env.ADDITIONAL_ALLOWED_ORIGINS),
    ],
    uploadLimits: {
      imageBytes: 10 * 1024 * 1024,
      videoBytes: 100 * 1024 * 1024,
      cvBytes: 5 * 1024 * 1024,
    },
    usesRemoteDatabase: isRemoteMongoUri(env.MONGODB_URI),
    allowRemoteDatabase: allowsRemoteDatabase(env),
  };
}
