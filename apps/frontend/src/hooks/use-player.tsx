import { useEffect, useState } from 'react';
import { Match, MatchData, Presence } from '@heroiclabs/nakama-js';
import { gameSocket } from '@core/game-client';

export enum PlayerState {
  READY = 'READY',
  NOT_READY = 'NOT_READY',
}
export function usePlayer({ match }: { match: Match | null }) {
  const [players, setPlayers] = useState<Presence[]>([]);
  const [playerState, setPlayerState] = useState(PlayerState.NOT_READY);
  const [myScore, setMyScore] = useState(0);

  useEffect(() => {
    if (!match) return;
    setPlayerState(PlayerState.READY);
  }, [match]);

  const playersEventsReceiver = (matchData: MatchData) => {
    const decodedData = new TextDecoder().decode(matchData.data);
    switch (decodedData) {
      case PlayerState.READY:
        setPlayerState(PlayerState.READY);
        break;
      case PlayerState.NOT_READY:
        setPlayerState(PlayerState.NOT_READY);
        break;
    }
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
    playerState,
    playersEventsReceiver,
  };
}
