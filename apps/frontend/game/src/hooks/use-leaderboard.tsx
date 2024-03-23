'use client';
import { useAppSelector } from './use-redux-typed';
import { publish, subscribe } from '@kingo/events';
import { TimeUpEventKey } from './use-questions';
import { SOCKET_OP_CODES, SOCKET_SYNC, useMatchSocket } from './match';
import { HOST_COMMANDS } from '../components/match/match';

export function useLeaderboard({
  showLeaderboardForTimeInMs = 5000,
}: {
  showLeaderboardForTimeInMs?: number;
}) {
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const amIPlayer = useAppSelector((state) => !state.match.amIHost);
  const { sendMatchState } = useMatchSocket();

  subscribe(TimeUpEventKey, () => {
    syncLeaderboard(HOST_COMMANDS.SHOW_LEADERBOARD);

    setTimeout(
      () => syncLeaderboard(HOST_COMMANDS.HIDE_LEADERBOARD),
      showLeaderboardForTimeInMs
    );
  });

  amIPlayer &&
    subscribe(SOCKET_SYNC.LEADERBOARD, (decodedData) => {
      decodedData === HOST_COMMANDS.SHOW_LEADERBOARD
        ? publish(HOST_COMMANDS.SHOW_LEADERBOARD)
        : publish(HOST_COMMANDS.HIDE_LEADERBOARD);
    });

  function syncLeaderboard(command: HOST_COMMANDS) {
    publish(command);
    amIHost && sendMatchState(SOCKET_OP_CODES.LEADERBOARD, command);
  }
}
