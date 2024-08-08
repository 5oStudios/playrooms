import { Client } from 'colyseus.js';

// export const {
//   client,
//   connectToColyseus,
//   disconnectFromColyseus,
//   useColyseusRoom,
//   useColyseusState,
// } = colyseus<RoomState>('ws://localhost:3000');
export const gameClient = new Client(process.env['BACKEND_WS_URL']);
