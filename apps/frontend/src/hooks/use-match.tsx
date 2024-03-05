import { useEffect, useState } from 'react';
import { gameSocket } from '@core/game-client';
import { MatchOpCodes } from '../components/match/match';
import { PlayerState, PlayerStateEventsKey } from './use-player';
import { HostEventsKey, HostState } from './use-host';
import { usePubSub } from './use-pub-sub';
import { QuestionsFinishedEventKey } from './use-questions';
import { useAppDispatch, useAppSelector } from './use-redux-typed';
import { setCurrentMatch } from '../store/features/matchSlice';
import { MatchData } from '@heroiclabs/nakama-js';

export enum MatchState {
  LOADING = 'LOADING',
  READY = 'READY',
  STARTED = 'STARTED',
  ENDED = 'ENDED',
  NOT_FOUND = 'NOT_FOUND',
}
export const MatchEventsKey = 'match_events';

export function useMatch({ ticket, token }: { ticket: string; token: string }) {
  const match = useAppSelector((state) => state.match.currentMatch);
  const dispatch = useAppDispatch();
  const { publish, subscribe } = usePubSub();

  const [hostState, setHostState] = useState<HostState>(HostState.NOT_ELECTED);
  const [matchState, setMatchState] = useState<MatchState>(MatchState.LOADING);
  const [myPlayerState, setMyPlayerState] = useState<PlayerState>(
    PlayerState.NOT_READY
  );

  useEffect(() => {
    if (match) return;
    gameSocket
      .joinMatch(ticket, token)
      .then((match) => {
        dispatch(setCurrentMatch(match));
      })
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
  }, [dispatch, match, publish, ticket, token]);

  subscribe({
    event: HostEventsKey,
    callback: setHostState,
  });

  subscribe({
    event: PlayerStateEventsKey,
    callback: setMyPlayerState,
  });

  subscribe({
    event: QuestionsFinishedEventKey,
    callback: () => setMatchState(MatchState.ENDED),
  });

  useEffect(() => {
    console.log('matchState', matchState);
    console.log('myPlayerState', myPlayerState);
    console.log('hostState', hostState);
    if (
      matchState === MatchState.READY &&
      myPlayerState === PlayerState.READY &&
      hostState === HostState.ELECTED
    ) {
      setMatchState(MatchState.STARTED);
    }
  }, [matchState, myPlayerState, hostState, setMatchState]);

  const matchSocketEventsReceiver = (matchData: MatchData) => {
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
  useEffect(() => {
    publish(MatchEventsKey, matchState);
  }, [matchState, publish]);

  return {
    match,
    matchState,
    matchEventsReceiver: matchSocketEventsReceiver,
    setMatchState,
  };
}
