'use client';
import { useEffect, useState } from 'react';
import { Presence } from '@heroiclabs/nakama-js';
import { AnswerEvent } from '../components/match/match';
import { usePubSub } from './use-pub-sub';
import { useAppDispatch, useAppSelector } from './use-redux-typed';
import { QuestionAnswerEventKey } from './use-questions';
import {
  PlayerState,
  setMyPlayer,
  setOtherPlayersScore,
  setPlayerScore,
  setPlayerState,
} from '../store/features/playersSlice';

export const PlayerStateEventsKey = 'player_events';
export const OtherPlayersScoreEventKey = 'other_players_score';

export enum PlayerScoreAction {
  ADD = 'add',
  SUBTRACT = 'subtract',
}
export function usePlayer() {
  const match = useAppSelector((state) => state.match.currentMatch);
  const dispatch = useAppDispatch();

  const [players, setPlayers] = useState<Presence[]>([]);
  const { publish, subscribe } = usePubSub();

  // const changeLocalPlayerScore = useCallback(
  //   ({ id, username, score, action }: IPlayerScoreMessageDTO) => {
  //     console.log('Changing local score', id, username, score, action);
  //   //   setPlayersScore((prevPlayersScore) => {
  //   //     const playerIndex = prevPlayersScore.findIndex(
  //   //       (player) => player.id === id
  //   //     );
  //   //     const newPlayer = playerIndex === -1;
  //   //     if (newPlayer) {
  //   //       return [...prevPlayersScore, { id, username, score }];
  //   //     }
  //   //     prevPlayersScore[playerIndex].score =
  //   //       action === PlayerScoreAction.ADD
  //   //         ? prevPlayersScore[playerIndex].score + score
  //   //         : prevPlayersScore[playerIndex].score - score;
  //   //
  //   //     return prevPlayersScore;
  //   //   });
  //   // },
  //   []
  // );
  //
  // const syncScore = useCallback(
  //   ({ score, action }: { score: number; action: PlayerScoreAction }) => {
  //     console.log('Changing score', score, action);
  //     const playerScoreMessage = new PlayerScoreMessageDTO({
  //       id: match?.self.user_id,
  //       username: match?.self.username,
  //       score,
  //       action,
  //     });
  //     // changeLocalPlayerScore(playerScoreMessage);
  //     gameSocket.sendMatchState(
  //       match?.match_id,
  //       MatchOpCodes.PLAYER_SCORE,
  //       playerScoreMessage.toUint8Array()
  //     );
  //   },
  //   [
  //     // changeLocalPlayerScore,
  //     match?.match_id,
  //     match?.self.user_id,
  //     match?.self.username,
  //   ]
  // );

  useEffect(() => {
    if (!match) return;

    // syncScore({
    //   score: 0,
    //   action: PlayerScoreAction.ADD,
    // });
    // match.presences &&
    //   match.presences.forEach((player) => {
    //     setPlayers((prevPlayers) => [...prevPlayers, player]);
    //     changeLocalPlayerScore({
    //       id: player.user_id,
    //       username: player.username,
    //       score: 0,
    //       action: PlayerScoreAction.ADD,
    //     });
    //   });
    dispatch(
      setMyPlayer({
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
      dispatch(setMyPlayer(null));
      setPlayers([]);
    };
  }, [dispatch]);
  //
  // gameSocket.onmatchpresence = (matchPresence) => {
  //   matchPresence.joins &&
  //     (() => {
  //       matchPresence.joins.forEach((player) => {
  //         if (!players.find((p) => p.user_id === player.user_id)) {
  //           setPlayers((prevPlayers) => [...prevPlayers, player]);
  //         }
  //         // changeLocalPlayerScore({
  //         //   id: player.user_id,
  //         //   username: player.username,
  //         //   score: 0,
  //         //   action: PlayerScoreAction.ADD,
  //         // });
  //       });
  //     })();
  //   matchPresence.leaves &&
  //     setPlayers((prevPlayers) =>
  //       prevPlayers.filter((player) => !matchPresence.leaves.includes(player))
  //     );
  // };

  subscribe({
    event: QuestionAnswerEventKey,
    callback: (answerEvent: AnswerEvent) => {
      console.log('Got Answer', answerEvent);
      dispatch(
        setPlayerScore({
          points: answerEvent.deservedScore,
          action: answerEvent.scoreAction,
        })
      );
      publish(OtherPlayersScoreEventKey, {
        id: match?.self.user_id,
        points: answerEvent.deservedScore,
        action: answerEvent.scoreAction,
      });
    },
  });

  subscribe({
    event: 'match_started',
    callback: () => {
      dispatch(setPlayerState(PlayerState.PLAYING));
    },
  });

  subscribe({
    event: OtherPlayersScoreEventKey,
    callback: ({ id, score, action }: IPlayerScoreMessageDTO) => {
      dispatch(
        setOtherPlayersScore({
          id,
          action,
          points: score,
        })
      );
    },
  });

  return {
    players,
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
