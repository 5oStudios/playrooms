// import { Session } from '@heroiclabs/nakama-js';
// import {
//   gameClient,
//   LOCAL_STORAGE_AUTH_KEY,
//   LOCAL_STORAGE_REFRESH_KEY,
// } from '@core/game-client';
// import { useState } from 'react';
//
// const currentDateInSeconds = Date.now() / 1000;
// export const useSession = () => {
//   const [session, setSession] = useState<Session | null>(null);
//   if (auth && refresh) {
//     const session = Session.restore(auth, refresh);
//     if (session.isexpired(currentDateInSeconds))
//       gameClient.sessionRefresh(session).then(setTokens);
//
//     setSession(session);
//     gameClient.socket = gameClient.createSocket();
//     gameClient.socket.connect(session, true);
//   }
//
//   return session;
// };
