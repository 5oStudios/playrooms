'use client';
import { useEffect, useState } from 'react';
import { gameSocket } from '@kingo/game-client';
import { SOCKET_OP_CODES, SOCKET_SYNC } from '../components/match/match';
import { useAppSelector } from './use-redux-typed';
import { TimeUpEventKey } from './use-questions';
import { subscribe } from '@kingo/events';

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

  // Cleanup
  useEffect(() => {
    return () => {
      setIsLeaderboardVisible(false);
    };
  }, []);

  subscribe(SOCKET_SYNC.LEADERBOARD, (decodedData: string) =>
    setIsLeaderboardVisible(decodedData === LeaderboardState.SHOW)
  );

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

  subscribe(TimeUpEventKey, previewLeaderboard);

  return {
    isLeaderboardVisible,
  };
}
