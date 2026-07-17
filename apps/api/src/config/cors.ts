import { CorsOptions } from 'cors';
import { RuntimeConfig } from './runtime';

export function createCorsOptions(runtimeConfig: RuntimeConfig): CorsOptions {
  const allowedOrigins = new Set(runtimeConfig.allowedOrigins);

  return {
    credentials: true,
    origin(origin, callback) {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.has(origin)) {
        callback(null, origin);
        return;
      }

      callback(null, false);
    },
  };
}
