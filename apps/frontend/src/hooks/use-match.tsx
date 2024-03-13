'use client';
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
import { SocketState } from '../store/features/socketSlice';

export enum MatchState {
  LOADING = 'LOADING',
  READY = 'READY',
  STARTED = 'STARTED',
  ENDED = 'ENDED',
  NOT_FOUND = 'NOT_FOUND',
}
export const MatchEventsKey = 'match_events';

export function useMatch({
  matchId,
  ticket,
  token,
}: {
  matchId?: string;
  ticket?: string;
  token?: string;
}) {
  const { publish, subscribe } = usePubSub();

  const [hostState, setHostState] = useState<HostState>(HostState.NOT_ELECTED);
  const [myPlayerState, setMyPlayerState] = useState<PlayerState>(
    PlayerState.NOT_READY
  );
  const [matchState, setMatchState] = useState<MatchState>(MatchState.LOADING);

  useJoinMatch({ matchId, ticket, token });

  subscribe({
    event: HostEventsKey,
    callback: setHostState,
  });

  subscribe({
    event: PlayerStateEventsKey,
    callback: setMyPlayerState,
  });

  subscribe({
    event: MatchEventsKey,
    callback: setMatchState,
  });

  subscribe({
    event: QuestionsFinishedEventKey,
    callback: () => setMatchState(MatchState.ENDED),
  });

  useEffect(() => {
    if (
      matchState === MatchState.READY &&
      myPlayerState === PlayerState.READY &&
      hostState === HostState.ELECTED
    ) {
      setMatchState(MatchState.STARTED);
    }
  }, [matchState, myPlayerState, hostState]);

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

  return {
    matchState,
    matchSocketEventsReceiver,
    setMatchState,
  };
}

const useJoinMatch = ({
  matchId,
  ticket,
  token,
}: {
  matchId?: string;
  ticket?: string;
  token?: string;
}) => {
  const match = useAppSelector((state) => state.match.currentMatch);
  const socket = useAppSelector((state) => state.socket);
  const dispatch = useAppDispatch();
  const { publish } = usePubSub();

  useEffect(() => {
    if (socket !== SocketState.CONNECTED) return;
    if (match) return;

    gameSocket
      .joinMatch(matchId || ticket, token)
      .then((match) => {
        dispatch(setCurrentMatch(match));
      })
      .then(() => {
        publish(MatchEventsKey, MatchState.READY);
        gameSocket.sendMatchState(
          match?.match_id,
          MatchOpCodes.MATCH_STATE,
          MatchState.READY
        );
      })
      .catch((error) => {
        console.error('Error joining match', error);
        publish(MatchEventsKey, MatchState.NOT_FOUND);
      });
  }, [dispatch, match, matchId, token, ticket, publish, socket]);

  // Cleanup
  useEffect(() => {
    return () => {
      match &&
        gameSocket
          .leaveMatch(match.match_id)
          .then(() => dispatch(setCurrentMatch(null)));
    };
  }, [dispatch, match]);
};
