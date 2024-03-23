'use client';
import { useEffect, useState } from 'react';
import { useAppSelector } from './use-redux-typed';
import { publish, subscribe } from '@kingo/events';
import { TimeUpEventKey } from './use-questions';
import { SOCKET_OP_CODES, SOCKET_SYNC, useMatchSocket } from './match';

export enum LeaderboardState {
  VISIBLE = 'VISIBLE',
  HIDDEN = 'HIDDEN',
}
export enum LEADERBOARD_COMMANDS {
  SHOW = 'show_leaderboard',
  HIDE = 'hide_leaderboard',
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
  subscribe(SOCKET_SYNC.LEADERBOARD, (decodedData: string) => {
    setIsLeaderboardVisible(decodedData === LeaderboardState.VISIBLE);
  });

  subscribe(TimeUpEventKey, () => {
    setIsLeaderboardVisible(true);
    publish(LEADERBOARD_COMMANDS.SHOW);
    amIHost &&
      sendMatchState(SOCKET_OP_CODES.LEADERBOARD, LeaderboardState.VISIBLE);

    setTimeout(() => {
      setIsLeaderboardVisible(false);
      publish(LEADERBOARD_COMMANDS.HIDE);
      amIHost &&
        sendMatchState(SOCKET_OP_CODES.LEADERBOARD, LeaderboardState.HIDDEN);
    }, showLeaderboardForTime);
  });

  return {
    isLeaderboardVisible,
  };
}
