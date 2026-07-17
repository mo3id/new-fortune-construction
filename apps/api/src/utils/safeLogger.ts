import { redactSensitiveValue } from './redaction';

export const safeLogger = {
  info(message: string): void {
    console.log(redactSensitiveValue(message));
  },
  warn(message: string): void {
    console.warn(redactSensitiveValue(message));
  },
  error(message: string, error?: unknown): void {
    const suffix = error ? ` ${redactSensitiveValue(error)}` : '';
    console.error(`${redactSensitiveValue(message)}${suffix}`);
  },
};
