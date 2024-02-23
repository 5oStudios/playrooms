import { Client } from '@heroiclabs/nakama-js';

const serverKey = 'defaultkey',
  serverAddr = '65.109.11.0',
  serverPort = '7350',
  ssl = false,
  timeout = 10000,
  autoRefreshSession = true;

const nakamaClient = new Client(
  serverKey,
  serverAddr,
  serverPort,
  ssl,
  timeout,
  autoRefreshSession
);
const nakamaSocket = nakamaClient.createSocket(false);

export { nakamaClient, nakamaSocket };
