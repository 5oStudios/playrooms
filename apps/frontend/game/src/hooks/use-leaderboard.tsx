'use client';
import { useEffect, useState } from 'react';
import { useAppSelector } from './use-redux-typed';
import { subscribe } from '@kingo/events';
import { TimeUpEventKey } from './use-questions';
import { SOCKET_OP_CODES, SOCKET_SYNC, useMatchSocket } from './match';

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
  const { sendMatchState } = useMatchSocket();

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
      sendMatchState(SOCKET_OP_CODES.LEADERBOARD, LeaderboardState.SHOW);
      setTimeout(() => {
        setIsLeaderboardVisible(false);
        sendMatchState(SOCKET_OP_CODES.LEADERBOARD, LeaderboardState.HIDE);
      }, showLeaderboardForTime);
    }
  };

  subscribe(TimeUpEventKey, previewLeaderboard);

  return {
    isLeaderboardVisible,
  };
}
