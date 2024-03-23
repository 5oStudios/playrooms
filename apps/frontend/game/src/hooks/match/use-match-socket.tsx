import { useAppSelector } from '../use-redux-typed';
import { gameSocket } from '@kingo/game-client';
import { useCallback, useRef } from 'react';

export enum SOCKET_OP_CODES {
  MATCH_STATE = 100,
  HOST_STATE = 101,
  PLAYERS_SCORE = 103,
  QUESTION_INDEX = 104,
  LEADERBOARD = 106,
}
export enum SOCKET_SYNC {
  MATCH_STATE = 'match_state',
  HOST_STATE = 'host_state',
  PLAYER_SCORE = 'player_score',
  QUESTION_INDEX = 'question_index',
  LEADERBOARD = 'leaderboard',
}
export const useMatchSocket = () => {
  const { currentMatch, currentMatchState } = useAppSelector((state) => ({
    currentMatch: state.match.currentMatch,
    currentMatchState: state.match.currentMatchState,
  }));
  const matchId = useRef(currentMatch?.match_id);

  const sendMatchState = useCallback(
    (opCode: SOCKET_OP_CODES, data: string | Uint8Array) => {
      gameSocket.sendMatchState(matchId.current, opCode, data);
    },
    []
  );

  return {
    sendMatchState,
  };
};
