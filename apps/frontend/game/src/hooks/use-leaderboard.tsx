'use client';
import { useEffect, useState } from 'react';
import { gameSocket } from '@core/game-client';
import { SOCKET_OP_CODES, SOCKET_SYNC } from '../components/match/match';
import { useAppSelector } from './use-redux-typed';
import { usePubSub } from './use-pub-sub';
import { TimeUpEventKey } from './use-questions';

export enum LeaderboardState {
  SHOW = 'SHOW',
  HIDE = 'HIDE',
}
export function useLeaderboard({
  showLeaderboardForTimeInMs = 5000,
}: {
  showLeaderboardForTimeInMs?: number;
}) {
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const match = useAppSelector((state) => state.match.currentMatch);

  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
  const [showLeaderboardForTime] = useState(showLeaderboardForTimeInMs);

  const { subscribe } = usePubSub();

  // Cleanup
  useEffect(() => {
    return () => {
      setIsLeaderboardVisible(false);
    };
  }, []);

  subscribe({
    event: SOCKET_SYNC.LEADERBOARD,
    callback: (decodedData: string) =>
      setIsLeaderboardVisible(decodedData === LeaderboardState.SHOW),
  });

  const previewLeaderboard = () => {
    if (amIHost) {
      setIsLeaderboardVisible(true);
      gameSocket.sendMatchState(
        match.match_id,
        SOCKET_OP_CODES.LEADERBOARD,
        LeaderboardState.SHOW
      );
      setTimeout(() => {
        setIsLeaderboardVisible(false);
        gameSocket.sendMatchState(
          match.match_id,
          SOCKET_OP_CODES.LEADERBOARD,
          LeaderboardState.HIDE
        );
      }, showLeaderboardForTime);
    }
  };

  subscribe({
    event: TimeUpEventKey,
    callback: previewLeaderboard,
  });

  return {
    isLeaderboardVisible,
  };
}
