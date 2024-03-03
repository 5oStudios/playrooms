import { useState } from 'react';
import { gameSocket } from '@core/game-client';
import { LeaderboardState, MatchOpCodes } from '../components/match/match';
import { Match } from '@heroiclabs/nakama-js';

export function useLeaderboard({
  match,
  amIHost,
  showLeaderboardForTimeInMs = 5000,
}: {
  match: Match | null;
  amIHost: boolean;
  showLeaderboardForTimeInMs?: number;
}) {
  const [isLeaderboardVisible, setIsLeaderboardVisible] = useState(false);
  const [showLeaderboardForTime] = useState(showLeaderboardForTimeInMs);

  const leaderboardStateHandler = (matchData: any) => {
    const decodedData = new TextDecoder().decode(matchData.data);
    switch (matchData.op_code) {
      case MatchOpCodes.LEADERBOARD:
        if (decodedData === LeaderboardState.SHOW) {
          setIsLeaderboardVisible(true);
        } else if (decodedData === LeaderboardState.HIDE) {
          setIsLeaderboardVisible(false);
        }
        break;
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
  };
}
