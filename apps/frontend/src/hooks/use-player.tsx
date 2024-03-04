import { useEffect, useState } from 'react';
import { Match, MatchData, Presence } from '@heroiclabs/nakama-js';
import { gameSocket } from '@core/game-client';
import { MatchOpCodes } from '../components/match/match';

export enum PlayerState {
  READY = 'READY',
  NOT_READY = 'NOT_READY',
}

export enum PlayerScoreAction {
  ADD = 'add',
  SUBTRACT = 'subtract',
}
export function usePlayer({ match }: { match: Match | null }) {
  const [players, setPlayers] = useState<Presence[]>([]);
  const [myPlayerState, setMyPlayerState] = useState(PlayerState.NOT_READY);
  const [playersScore, setPlayersScore] = useState<
    Array<{ id: string; username: string; score: number }>
  >([]);

  useEffect(() => {
    if (!match) return;
    const initScore = {
      id: match.self.user_id,
      username: match.self.username,
      score: 0,
      action: PlayerScoreAction.ADD,
    };
    setPlayersScore([initScore]);
    gameSocket.sendMatchState(
      match.match_id,
      MatchOpCodes.PLAYER_STATE,
      new PlayerScoreMessageDTO(initScore).toUint8Array()
    );

    setMyPlayerState(PlayerState.READY);
  }, [match]);

  const playerStateEventsReceiver = (matchData: MatchData) => {
    const decodedData = new TextDecoder().decode(matchData.data);
    switch (decodedData) {
      case PlayerState.READY:
        setMyPlayerState(PlayerState.READY);
        break;
      case PlayerState.NOT_READY:
        setMyPlayerState(PlayerState.NOT_READY);
        break;
    }
  };

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

  const playerScoreEventsReceiver = (matchData: MatchData) => {
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
      setPlayers((prevPlayers) => [...prevPlayers, ...matchPresence.joins]);
    matchPresence.leaves &&
      setPlayers((prevPlayers) =>
        prevPlayers.filter((player) => !matchPresence.leaves.includes(player))
      );
  };

  return {
    players,
    playersScore,
    myPlayerState,
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
    playerStateEventsReceiver,
    playerScoreEventsReceiver,
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
