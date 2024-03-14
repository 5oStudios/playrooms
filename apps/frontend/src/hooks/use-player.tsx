'use client';
import { useEffect } from 'react';
import { Presence } from '@heroiclabs/nakama-js';
import {
  PLAYER_COMMANDS,
  SOCKET_OP_CODES,
  SOCKET_SYNC,
} from '../components/match/match';
import { usePubSub } from './use-pub-sub';
import { useAppDispatch, useAppSelector } from './use-redux-typed';
import {
  addPlayer,
  clearPlayers,
  PlayerScoreAction,
  PlayerState,
  removePlayer,
  setPlayerScore,
  setPlayerState,
} from '../store/features/playersSlice';
import { gameSocket } from '@core/game-client';

export const PlayerStateEventsKey = 'player_events';
export const OtherPlayersScoreEventKey = 'other_players_score';

export function usePlayer() {
  const match = useAppSelector((state) => state.match.currentMatch);
  const dispatch = useAppDispatch();
  const { publish, subscribe } = usePubSub();

  useEffect(() => {
    if (!match) return;

    match.presences.forEach((oldPlayer) => {
      dispatch(
        addPlayer({
          id: oldPlayer.user_id,
          username: oldPlayer.username,
          score: 0,
          state: PlayerState.READY,
        })
      );
    });
    dispatch(
      addPlayer({
        id: match.self.user_id,
        username: match.self.username,
        score: 0,
        state: PlayerState.READY,
      })
    );
  }, [dispatch, match]);

  // Cleanup
  useEffect(() => {
    return () => {
      dispatch(clearPlayers());
    };
  }, [dispatch]);

  subscribe({
    event: 'match_started',
    callback: () => {
      dispatch(
        setPlayerState({ id: match?.self.user_id, state: PlayerState.PLAYING })
      );
    },
  });

  subscribe({
    event: PLAYER_COMMANDS.SYNC_SCORE,
    callback: (playerScore: {
      id: string;
      points: number;
      action: PlayerScoreAction;
    }) => {
      dispatch(setPlayerScore(playerScore));
      gameSocket.sendMatchState(
        match?.match_id,
        SOCKET_OP_CODES.PLAYERS_SCORE,
        JSON.stringify(playerScore)
      );
    },
  });

  subscribe({
    event: SOCKET_SYNC.PLAYER_SCORE,
    callback: (decodedData: string) => {
      dispatch(setPlayerScore(JSON.parse(decodedData)));
    },
  });

  subscribe({
    event: 'match_presence_joined',
    callback: (player: Presence) => {
      dispatch(
        addPlayer({
          id: player.user_id,
          username: player.username,
          score: 0,
          state: PlayerState.READY,
        })
      );
    },
  });

  subscribe({
    event: 'match_presence_left',
    callback: (player: Presence) => {
      dispatch(removePlayer(player.user_id));
    },
  });
}
export function objectToUint8Array(obj: Record<string, unknown>): Uint8Array {
  const jsonString = JSON.stringify(obj);
  const encoder = new TextEncoder();
  return encoder.encode(jsonString);
}

export function uint8ArrayToObject(
  uint8Array: Uint8Array
): Record<string, unknown> {
  const decoder = new TextDecoder();
  const jsonString = decoder.decode(uint8Array);
  return JSON.parse(jsonString);
}

interface IPlayerScoreMessageDTO {
  id: string;
  username: string;
  score: number;
  action: PlayerScoreAction;
}
export class PlayerScoreMessageDTO {
  id: string;
  username: string;
  score: number;
  action: PlayerScoreAction;

  constructor(obj: IPlayerScoreMessageDTO) {
    Object.assign(this, obj);
  }

  public toUint8Array(): Uint8Array {
    return objectToUint8Array({
      id: this.id,
      username: this.username,
      score: this.score,
      action: this.action,
    });
  }
}
