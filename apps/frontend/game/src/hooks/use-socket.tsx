// import { useAppDispatch, useAppSelector } from './use-redux-typed';
// import { setSocket, SocketState } from '../store/features/socketSlice';
// import { gameSocket } from '@kingo/game-client';
// import { useEffect } from 'react';
//
// export const useSocket = () => {
//   const session = useAppSelector((state) => state.session);
//   const isSocketConnected = useAppSelector(
//     (state) => state.socket === SocketState.CONNECTED
//   );
//   const dispatch = useAppDispatch();
//
//   console.log('Socket state', isSocketConnected);
//   useEffect(() => {
//     if (!session) return;
//     if (isSocketConnected) return;
//     gameSocket
//       .connect(session, true)
//       .then(() => {
//         dispatch(setSocket(SocketState.CONNECTED));
//         console.log('Connected to socket');
//       })
//       .catch((error) => {
//         console.error('Error connecting to socket: ', error.message);
//         dispatch(setSocket(SocketState.DISCONNECTED));
//       });
//
//     return () => {
//       gameSocket.disconnect(true);
//       dispatch(setSocket(SocketState.DISCONNECTED));
//     };
//   }, [dispatch, isSocketConnected, session]);
// };
