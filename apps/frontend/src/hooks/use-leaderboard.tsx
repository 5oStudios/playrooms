import { useState } from 'react';
import { gameSocket } from '@core/game-client';
import { LeaderboardState, MatchOpCodes } from '../components/match/match';
import { Match, MatchData } from '@heroiclabs/nakama-js';

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

  const leaderboardEventsReceiver = (matchData: MatchData) => {
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
    leaderboardEventsReceiver,
  };
}
