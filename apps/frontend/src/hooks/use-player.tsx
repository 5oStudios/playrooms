import { useEffect, useState } from 'react';
import { MatchData, Presence } from '@heroiclabs/nakama-js';
import { gameSocket } from '@core/game-client';
import { MatchOpCodes } from '../components/match/match';
import { usePubSub } from './use-pub-sub';
import { useAppSelector } from './use-redux-typed';

export enum PlayerState {
  READY = 'READY',
  NOT_READY = 'NOT_READY',
}

export const PlayerStateEventsKey = 'player_events';

export enum PlayerScoreAction {
  ADD = 'add',
  SUBTRACT = 'subtract',
}
export function usePlayer() {
  const match = useAppSelector((state) => state.match.currentMatch);

  const [players, setPlayers] = useState<Presence[]>([]);
  const [myPlayerState, setMyPlayerState] = useState(PlayerState.NOT_READY);
  const [playersScore, setPlayersScore] = useState<
    Array<{ id: string; username: string; score: number }>
  >([]);

  const { publish } = usePubSub();

  useEffect(() => {
    if (!match) return;

    changePlayerScore({
      id: match.self.user_id,
      username: match.self.username,
      score: 0,
      action: PlayerScoreAction.ADD,
    });
    setMyPlayerState(PlayerState.READY);
  }, [match]);

  // Cleanup
  useEffect(() => {
    return () => {
      setMyPlayerState(PlayerState.NOT_READY);
      setPlayers([]);
      setPlayersScore([]);
    };
  }, []);

  const changePlayerScore = ({
    id,
    username,
    score,
    action,
  }: IPlayerScoreMessageDTO) => {
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
  };

  const playerScoreSocketEventsReceiver = (matchData: MatchData) => {
    const decodedData = new TextDecoder().decode(matchData.data);
    const newplayerScore = new PlayerScoreMessageDTO(JSON.parse(decodedData));

    changePlayerScore({
      id: newplayerScore.id,
      username: newplayerScore.username,
      score: newplayerScore.score,
      action: newplayerScore.action,
    });
  };

  gameSocket.onmatchpresence = (matchPresence) => {
    matchPresence.joins &&
      (() => {
        matchPresence.joins.forEach((player) => {
          if (!players.find((p) => p.user_id === player.user_id)) {
            setPlayers((prevPlayers) => [...prevPlayers, player]);
          }
          changePlayerScore({
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
  useEffect(() => {
    publish(PlayerStateEventsKey, myPlayerState);
  }, [myPlayerState, publish]);

  return {
    players,
    playersScore,
    changeScore: ({
      score,
      action,
    }: {
      score: number;
      action: PlayerScoreAction;
    }) => {
      const playerScoreMessage = new PlayerScoreMessageDTO({
        id: match?.self.user_id,
        username: match?.self.username,
        score,
        action,
      });
      changePlayerScore({
        id: match.self.user_id,
        username: match.self.username,
        score,
        action,
      });
      gameSocket.sendMatchState(
        match?.match_id,
        MatchOpCodes.PLAYER_SCORE,
        playerScoreMessage.toUint8Array()
      );
    },
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