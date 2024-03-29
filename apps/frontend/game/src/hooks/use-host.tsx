'use client';

import { useCallback, useEffect } from 'react';

import { subscribe } from '@kingo/events';

import { setAmIHost, setHostState } from '../store/features/matchSlice';
import { SOCKET_OP_CODES, SOCKET_SYNC, useMatchSocket } from './match';
import { useAppDispatch, useAppSelector } from './use-redux-typed';

export enum HostState {
  ELECTED = 'ELECTED',
  NOT_ELECTED = 'NOT_ELECTED',
}
export function useHost() {
  const match = useAppSelector((state) => state.match.currentMatch);
  const dispatch = useAppDispatch();
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const { sendMatchState } = useMatchSocket();

  const syncHostState = useCallback(
    ({ amIHost, hostState }: { amIHost: boolean; hostState: HostState }) => {
      dispatch(setHostState(hostState));
      dispatch(setAmIHost(amIHost));
      amIHost && sendMatchState(SOCKET_OP_CODES.HOST_STATE, hostState);
    },
    [dispatch, sendMatchState],
  );

  subscribe(SOCKET_SYNC.HOST_STATE, (hostState: HostState) =>
    syncHostState({ amIHost, hostState }),
  );

  useEffect(() => {
    if (!match) return;
    const isFirstPlayer = !match.presences;
    const onlyOnePlayer =
      match.presences.length === 1 &&
      match.presences[0].user_id === match.self.user_id;
    isFirstPlayer || onlyOnePlayer
      ? syncHostState({ amIHost: true, hostState: HostState.ELECTED })
      : syncHostState({ amIHost: false, hostState: HostState.ELECTED });
  }, [dispatch, match, syncHostState]);

  // Cleanup
  useEffect(() => {
    return () => {
      setHostState(HostState.NOT_ELECTED);
    };
  }, []);
}
