import * as process from 'process';

export const NODE_ENV = process.env['NODE_ENV'];
export enum NODE_ENV_STATE {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}
const isProduction = NODE_ENV === NODE_ENV_STATE.PRODUCTION;
export const SERVER_KEY = 'defaultkey',
  HOST =
    process.env['NAKAMA_HOST'] || isProduction
      ? 'nakama.5ostudios.com'
      : 'localhost',
  PORT = process.env['NAKAMA_PORT'] || isProduction ? '' : '7350',
  USE_SSL = process.env['NAKAMA_SSL'] === 'true' || isProduction,
  TIMEOUT = 7500,
  AUTO_REFRESH_SESSION = true;
