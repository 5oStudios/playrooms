export const NODE_ENV = process.env['NODE_ENV'];
export enum NODE_ENV_STATE {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}
export const SERVER_KEY = 'defaultkey',
  // HOST = 'nakama.5ostudios.com',
  HOST = process.env['NAKAMA_HOST'] || 'nakama',
  PORT = process.env['NAKAMA_PORT'] || '7350',
  USE_SSL = process.env['NAKAMA_SSL'] || true,
  TIMEOUT = 7500,
  AUTO_REFRESH_SESSION = true;
