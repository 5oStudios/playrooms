import { useAppSelector } from './use-redux-typed';
import { gameClient } from '@core/game-client';

export enum SocketState {
  CONNECTED = 'CONNECTED',
  DISCONNECTED = 'DISCONNECTED',
  RECONNECTING = 'RECONNECTING',
  RECONNECTED = 'RECONNECTED',
}

export const useSocket = async () => {
  const session = useAppSelector((state) => state.session);
  // const [socketState, setSocketState] = useState<SocketState>(
  //   SocketState.DISCONNECTED
  // );

  const socket = gameClient.createSocket();
  await socket.connect(session, true);
  return socket;
  //
  // return ((state: SocketState) => {
  //   switch (state) {
  //     case SocketState.RECONNECTED:
  //     case SocketState.CONNECTED:
  //       return socket;
  //     case SocketState.DISCONNECTED:
  //     case SocketState.RECONNECTING:
  //       console.log('Socket reconnecting');
  //       connectSocket();
  //       return socket;
  //   }
  // })(socketState);
};
