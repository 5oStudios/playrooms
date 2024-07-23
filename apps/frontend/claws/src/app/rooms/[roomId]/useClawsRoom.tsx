import { useEffect, useState } from 'react';

import { RoomState } from '@kingo/game-client';

export const useClawsRoom = (roomState: RoomState) => {
  const [waitingInQueue, setWaitingInQueue] = useState(0);
  useEffect(() => {
    setWaitingInQueue(calcWaitingQueue(roomState.players.length));
  }, [roomState.players.length]);

  return { waitingInQueue };
};

export const calcWaitingQueue = (playersCount: number = 0) =>
  Math.max(playersCount - 1, 0);
