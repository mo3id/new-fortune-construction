import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const serverless = require('./serverless.cjs');

export default serverless.default || serverless;
