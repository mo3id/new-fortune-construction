process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'local-test-secret';
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
process.env.PUBLIC_SITE_ORIGIN = process.env.PUBLIC_SITE_ORIGIN || 'http://localhost:5173';
process.env.DASHBOARD_ORIGIN = process.env.DASHBOARD_ORIGIN || 'http://localhost:5174';
delete process.env.MONGODB_URI;
