'use client';

import { useEffect } from 'react';

import { Presence } from '@heroiclabs/nakama-js';

import { useSubscribe, useSubscribeIf } from '@kingo/events';

import { PLAYER_COMMANDS } from '../components/match/match';
import { MatchState } from '../store/features/matchSlice';
import {
  PlayerScoreAction,
  PlayerState,
  addPlayer,
  clearPlayers,
  removePlayer,
  setPlayerScore,
  setPlayerState,
} from '../store/features/playersSlice';
import { SOCKET_OP_CODES, SOCKET_SYNC, useMatchSocket } from './match';
import { HostState } from './use-host';
import { useAppDispatch, useAppSelector } from './use-redux-typed';

export interface Player {
  id: string;
  username: string;
  score: number;
  state: PlayerState;
}

export enum PLAYER_PRESENCE {
  JOINED = 'match_presence_joined',
  LEFT = 'match_presence_left',
}

export function usePlayer() {
  const match = useAppSelector((state) => state.match.currentMatch);
  const matchState = useAppSelector((state) => state.match.currentMatchState);
  const dispatch = useAppDispatch();
  const hostState = useAppSelector((state) => state.match.hostState);
  const { sendMatchState } = useMatchSocket();

  useEffect(() => {
    if (!match) return;

    match.presences.forEach((oldPlayer) => {
      dispatch(
        addPlayer({
          user_id: oldPlayer.user_id,
          username: oldPlayer.username,
          score: 0,
          state: PlayerState.READY,
        }),
      );
    });
    dispatch(
      addPlayer({
        user_id: match.self.user_id,
        username: match.self.username,
        score: 0,
        state: PlayerState.READY,
      }),
    );
  }, [dispatch, match]);

  // Cleanup
  useEffect(() => {
    return () => {
      dispatch(clearPlayers());
    };
  }, [dispatch]);

  useSubscribe('match_started', () => {
    dispatch(
      setPlayerState({
        user_id: match?.self.user_id,
        state: PlayerState.PLAYING,
      }),
    );
  });

  useSubscribe(
    PLAYER_COMMANDS.SYNC_SCORE,
    (playerScore: {
      user_id: string;
      points: number;
      action: PlayerScoreAction;
    }) => {
      dispatch(setPlayerScore(playerScore));
      sendMatchState(
        SOCKET_OP_CODES.PLAYERS_SCORE,
        JSON.stringify(playerScore),
      );
    },
  );

  useSubscribe(SOCKET_SYNC.PLAYER_SCORE, (decodedData: string) => {
    dispatch(
      setPlayerScore(new PlayerScoreMessageDTO(JSON.parse(decodedData))),
    );
  });
  const isMatchPlayable =
    matchState === MatchState.STARTED ||
    matchState === MatchState.READY ||
    matchState === MatchState.LOADING;

  useSubscribeIf(
    isMatchPlayable && hostState === HostState.ELECTED,
    PLAYER_PRESENCE.JOINED,
    (player: PlayerPresenceMessageDTO) => {
      dispatch(
        addPlayer({
          user_id: player.user_id,
          username: player.username,
          score: 0,
          state: PlayerState.READY,
        }),
      );
    },
  );

  useSubscribeIf(isMatchPlayable, PLAYER_PRESENCE.LEFT, (player: Presence) => {
    dispatch(removePlayer(player.user_id));
  });
}
export function objectToUint8Array(obj: Record<string, unknown>): Uint8Array {
  const jsonString = JSON.stringify(obj);
  const encoder = new TextEncoder();
  return encoder.encode(jsonString);
}

export function uint8ArrayToObject(
  uint8Array: Uint8Array,
): Record<string, unknown> {
  const decoder = new TextDecoder();
  const jsonString = decoder.decode(uint8Array);
  return JSON.parse(jsonString);
}

interface IPlayerScoreMessageDTO {
  id: string;
  username: string;
  points: number;
  action: PlayerScoreAction;
}
export class PlayerScoreMessageDTO {
  user_id: string;
  username: string;
  points: number;
  action: PlayerScoreAction;

  constructor(obj: IPlayerScoreMessageDTO) {
    Object.assign(this, obj);
  }

  public toUint8Array(): Uint8Array {
    return objectToUint8Array({
      id: this.user_id,
      username: this.username,
      points: this.points,
      action: this.action,
    });
  }
}

export class PlayerPresenceMessageDTO
  implements Pick<Presence, 'username' | 'user_id'>
{
  user_id: string;
  username: string;

  constructor(obj: { user_id: string; username: string }) {
    Object.assign(this, obj);
  }
}
