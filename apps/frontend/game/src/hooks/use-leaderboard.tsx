'use client';
import { useAppSelector } from './use-redux-typed';
import { publish } from '@kingo/events';
import { TimeUpEventKey } from './use-questions';
import { SOCKET_OP_CODES, SOCKET_SYNC, useMatchSocket } from './match';
import { HOST_COMMANDS } from '../components/match/match';
import { MatchState } from '../store/features/matchSlice';
import { useMatchSubscribe } from './match/use-match-subscribe';

export function useLeaderboard({
  showLeaderboardForTimeInMs = 5000,
}: {
  showLeaderboardForTimeInMs?: number;
}) {
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const amIPlayer = useAppSelector((state) => !state.match.amIHost);
  const { sendMatchState } = useMatchSocket();
  const { useSubscribeIfMatch } = useMatchSubscribe();

  useSubscribeIfMatch(MatchState.PLAYING, TimeUpEventKey, () => {
    syncLeaderboard(HOST_COMMANDS.SHOW_LEADERBOARD);

    setTimeout(
      () => syncLeaderboard(HOST_COMMANDS.HIDE_LEADERBOARD),
      showLeaderboardForTimeInMs
    );
  });

  useSubscribeIfMatch(
    MatchState.PLAYING,
    SOCKET_SYNC.LEADERBOARD,
    (decodedData) => {
      amIPlayer && decodedData === HOST_COMMANDS.SHOW_LEADERBOARD
        ? publish(HOST_COMMANDS.SHOW_LEADERBOARD)
        : publish(HOST_COMMANDS.HIDE_LEADERBOARD);
    }
  );

  function syncLeaderboard(command: HOST_COMMANDS) {
    publish(command);
    amIHost && sendMatchState(SOCKET_OP_CODES.LEADERBOARD, command);
  }
}
