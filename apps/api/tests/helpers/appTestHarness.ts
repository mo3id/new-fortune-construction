import { once } from 'node:events';
import { AddressInfo } from 'node:net';
import { Server } from 'node:http';
import { createApp } from '../../src/index';
import { DatabaseStatus } from '../../src/config/db';
import { loadRuntimeConfig } from '../../src/config/runtime';

const defaultDbStatus: DatabaseStatus = {
  mode: 'local',
  ready: true,
  isNewDatabase: false,
};

export interface TestServer {
  baseUrl: string;
  close: () => Promise<void>;
}

export async function createTestServer(databaseStatus: DatabaseStatus = defaultDbStatus): Promise<TestServer> {
  const app = createApp(databaseStatus, loadRuntimeConfig({ ...process.env, NODE_ENV: 'test' }));
  const server: Server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address() as AddressInfo;

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,
    close: () =>
      new Promise<void>((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      }),
  };
}
