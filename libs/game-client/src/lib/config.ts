export const NODE_ENV = process.env['NODE_ENV'];
export enum NODE_ENV_STATE {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
  TEST = 'test',
}
export const SERVER_KEY = 'defaultkey',
  HOST =
    NODE_ENV === NODE_ENV_STATE.PRODUCTION
      ? 'nakama.5ostudios.com'
      : '65.109.11.0',
  PORT = NODE_ENV === NODE_ENV_STATE.PRODUCTION ? '' : '7350',
  USE_SSL = NODE_ENV === NODE_ENV_STATE.PRODUCTION,
  TIMEOUT = 7500,
  AUTO_REFRESH_SESSION = true;
