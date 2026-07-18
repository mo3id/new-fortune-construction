import createApp from '../apps/api/src/index';
import { connectDB } from '../apps/api/src/config/db';
import { loadRuntimeConfig } from '../apps/api/src/config/runtime';
import { safeLogger } from '../apps/api/src/utils/safeLogger';

let appPromise: ReturnType<typeof createServerlessApp> | null = null;

async function createServerlessApp() {
  const runtimeConfig = loadRuntimeConfig();
  const databaseStatus = await connectDB();
  return createApp(databaseStatus, runtimeConfig);
}

export default async function handler(req: any, res: any) {
  try {
    if (!appPromise) {
      appPromise = createServerlessApp();
    }

    const app = await appPromise;
    return app(req, res);
  } catch (error) {
    appPromise = null;
    safeLogger.error('Vercel API function failed.', error);
    res.status(500).json({ message: 'API unavailable', code: 'API_UNAVAILABLE' });
  }
}
