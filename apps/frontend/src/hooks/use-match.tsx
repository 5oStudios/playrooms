import { useEffect, useState } from 'react';
import { Match } from '@heroiclabs/nakama-js';
import { useSearchParams } from 'next/navigation';
import { gameSocket } from '@core/game-client';
import { MatchOpCodes } from '../components/match/match';

export enum MatchState {
  LOADING = 'LOADING',
  READY = 'READY',
  STARTED = 'STARTED',
  ENDED = 'ENDED',
  NOT_FOUND = 'NOT_FOUND',
}
export function useMatch() {
  const searchParams = useSearchParams();
  const ticket = searchParams.get('ticket');
  const token = searchParams.get('token');
  const [match, setMatch] = useState<null | Match>(null);
  const [matchState, setMatchState] = useState(MatchState.LOADING);

  useEffect(() => {
    !match &&
      gameSocket
        .joinMatch(ticket, token)
        .then(setMatch)
        .then(() => {
          setMatchState(MatchState.READY);
          gameSocket.sendMatchState(
            match?.match_id,
            MatchOpCodes.MATCH_STATE,
            MatchState.READY
          );
        })
        .catch((error) => {
          console.error('Error joining match', error);
          setMatchState(MatchState.NOT_FOUND);
        });
  }, [match, ticket, token]);

  const matchEventsReceiver = (matchData) => {
    const decodedData = new TextDecoder().decode(matchData.data);
    switch (decodedData) {
      case MatchState.STARTED:
        setMatchState(MatchState.STARTED);
        break;
      case MatchState.ENDED:
        setMatchState(MatchState.ENDED);
        break;
      case MatchState.LOADING:
        setMatchState(MatchState.LOADING);
        break;
      case MatchState.READY:
        setMatchState(MatchState.READY);
        break;
    }
  };

  return {
    match,
    matchState,
    matchEventsReceiver,
    setMatchState,
  };
}
