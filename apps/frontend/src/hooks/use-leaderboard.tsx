'use client';
import { useEffect, useState } from 'react';
import { gameSocket } from '@core/game-client';
import { MatchOpCodes } from '../components/match/match';
import { MatchData } from '@heroiclabs/nakama-js';
import { useAppSelector } from './use-redux-typed';

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

  const leaderboardSocketEventsReceiver = (matchData: MatchData) => {
    const decodedData = new TextDecoder().decode(matchData.data);
    if (decodedData === LeaderboardState.SHOW) {
      setIsLeaderboardVisible(true);
    } else if (decodedData === LeaderboardState.HIDE) {
      setIsLeaderboardVisible(false);
    }
  };

  const previewLeaderboard = () => {
    if (amIHost) {
      setIsLeaderboardVisible(true);
      gameSocket.sendMatchState(
        match.match_id,
        MatchOpCodes.LEADERBOARD,
        LeaderboardState.SHOW
      );
      setTimeout(() => {
        setIsLeaderboardVisible(false);
        gameSocket.sendMatchState(
          match.match_id,
          MatchOpCodes.LEADERBOARD,
          LeaderboardState.HIDE
        );
      }, showLeaderboardForTime);
    }
  };

  return {
    isLeaderboardVisible,
    previewLeaderboard: async () => {
      previewLeaderboard();
    },
    leaderboardSocketEventsReceiver,
  };
}
