'use client';
import { useEffect } from 'react';
import { gameSocket } from '@core/game-client';
import { MatchOpCodes } from '../components/match/match';
import { usePubSub } from './use-pub-sub';
import { useAppDispatch, useAppSelector } from './use-redux-typed';
import { setAmIHost, setHostState } from '../store/features/matchSlice';

export enum HostState {
  ELECTED = 'ELECTED',
  NOT_ELECTED = 'NOT_ELECTED',
}
export const HostEventsKey = 'host_events';
export function useHost() {
  const match = useAppSelector((state) => state.match.currentMatch);
  const { publish, subscribe } = usePubSub();
  const dispatch = useAppDispatch();
  const amIHost = useAppSelector((state) => state.match.amIHost);

  const syncHostState = ({
    amIHost,
    hostState,
  }: {
    amIHost: boolean;
    hostState: HostState;
  }) => {
    dispatch(setHostState(hostState));
    dispatch(setAmIHost(amIHost));
    amIHost &&
      gameSocket.sendMatchState(
        match.match_id,
        MatchOpCodes.HOST_STATE,
        hostState
      );
  };

  subscribe({
    event: HostEventsKey,
    callback: (hostState: HostState) => syncHostState({ amIHost, hostState }),
  });

  useEffect(() => {
    if (!match) return;
    const isFirstPlayer = !match.presences;
    const onlyOnePlayer =
      match.presences.length === 1 &&
      match.presences[0].user_id === match.self.user_id;
    isFirstPlayer || onlyOnePlayer
      ? syncHostState({ amIHost: true, hostState: HostState.ELECTED })
      : syncHostState({ amIHost: false, hostState: HostState.ELECTED });
  }, [dispatch, match]);

  // Cleanup
  useEffect(() => {
    return () => {
      setHostState(HostState.NOT_ELECTED);
    };
  }, []);
}
