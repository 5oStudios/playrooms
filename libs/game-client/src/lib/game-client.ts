import { Client } from 'colyseus.js';

// export const {
//   client,
//   connectToColyseus,
//   disconnectFromColyseus,
//   useColyseusRoom,
//   useColyseusState,
// } = colyseus<RoomState>('ws://localhost:3000');

const BACKEND_WS_URL =
  process.env['BACKEND_WS_URL'] ?? 'ws://api-kingo.5ostudios.com';
export const gameClient = new Client({
  secure: true,
  port: 443,
  hostname: 'api-kingo.5ostudios.com',
});
