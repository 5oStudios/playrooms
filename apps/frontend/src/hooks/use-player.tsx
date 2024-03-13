'use client';
import { useCallback, useEffect, useState } from 'react';
import { MatchData, Presence } from '@heroiclabs/nakama-js';
import { gameSocket } from '@core/game-client';
import { AnswerEvent, MatchOpCodes } from '../components/match/match';
import { usePubSub } from './use-pub-sub';
import { useAppDispatch, useAppSelector } from './use-redux-typed';
import { QuestionAnswerEventKey } from './use-questions';
import { PlayerState, setMyPlayerState } from '../store/features/playerSlice';

export const PlayerStateEventsKey = 'player_events';

export enum PlayerScoreAction {
  ADD = 'add',
  SUBTRACT = 'subtract',
}
export function usePlayer() {
  const match = useAppSelector((state) => state.match.currentMatch);
  const myPlayerState = useAppSelector((state) => state.player.myPlayerState);
  const dispatch = useAppDispatch();

  const [players, setPlayers] = useState<Presence[]>([]);
  const [playersScore, setPlayersScore] = useState<
    Array<{ id: string; username: string; score: number }>
  >([]);
  const { publish, subscribe } = usePubSub();

  const changeLocalPlayerScore = useCallback(
    ({ id, username, score, action }: IPlayerScoreMessageDTO) => {
      setPlayersScore((prevPlayersScore) => {
        const playerIndex = prevPlayersScore.findIndex(
          (player) => player.id === id
        );
        const newPlayer = playerIndex === -1;
        if (newPlayer) {
          return [...prevPlayersScore, { id, username, score }];
        }
        prevPlayersScore[playerIndex].score =
          action === PlayerScoreAction.ADD
            ? prevPlayersScore[playerIndex].score + score
            : prevPlayersScore[playerIndex].score - score;

        return prevPlayersScore;
      });
    },
    []
  );

  const changeScore = useCallback(
    ({ score, action }: { score: number; action: PlayerScoreAction }) => {
      const playerScoreMessage = new PlayerScoreMessageDTO({
        id: match?.self.user_id,
        username: match?.self.username,
        score,
        action,
      });
      changeLocalPlayerScore(playerScoreMessage);
      gameSocket.sendMatchState(
        match?.match_id,
        MatchOpCodes.PLAYER_SCORE,
        playerScoreMessage.toUint8Array()
      );
    },
    [
      changeLocalPlayerScore,
      match?.match_id,
      match?.self.user_id,
      match?.self.username,
    ]
  );

  useEffect(() => {
    if (!match) return;

    changeScore({
      score: 0,
      action: PlayerScoreAction.ADD,
    });
    dispatch(setMyPlayerState(PlayerState.READY));
  }, [changeScore, match]);

  useEffect(() => {
    publish(PlayerStateEventsKey, myPlayerState);
  }, [myPlayerState, publish]);

  // Cleanup
  useEffect(() => {
    return () => {
      dispatch(setMyPlayerState(PlayerState.NOT_READY));
      setPlayers([]);
      setPlayersScore([]);
    };
  }, [dispatch]);

  gameSocket.onmatchpresence = (matchPresence) => {
    matchPresence.joins &&
      (() => {
        matchPresence.joins.forEach((player) => {
          if (!players.find((p) => p.user_id === player.user_id)) {
            setPlayers((prevPlayers) => [...prevPlayers, player]);
          }
          changeLocalPlayerScore({
            id: player.user_id,
            username: player.username,
            score: 0,
            action: PlayerScoreAction.ADD,
          });
        });
      })();
    matchPresence.leaves &&
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => !matchPresence.leaves.includes(player))
      );
  };

  subscribe({
    event: QuestionAnswerEventKey,
    callback: (answerEvent: AnswerEvent) => {
      changeScore({
        score: answerEvent.deservedScore,
        action: answerEvent.scoreAction,
      });
    },
  });

  subscribe({
    event: 'match_started',
    callback: () => {
      dispatch(setMyPlayerState(PlayerState.PLAYING));
    },
  });

  const playerScoreSocketEventsReceiver = (matchData: MatchData) => {
    const decodedData = new TextDecoder().decode(matchData.data);
    const newPlayerScore = new PlayerScoreMessageDTO(JSON.parse(decodedData));

    changeLocalPlayerScore({
      id: newPlayerScore.id,
      username: newPlayerScore.username,
      score: newPlayerScore.score,
      action: newPlayerScore.action,
    });
  };

  return {
    players,
    playersScore,
    playerScoreSocketEventsReceiver,
  };
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
