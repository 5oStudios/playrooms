'use client';
import { useCallback, useEffect } from 'react';
import { gameSocket } from '@core/game-client';
import { SOCKET_OP_CODES, SOCKET_SYNC } from '../components/match/match';
import { usePubSub } from './use-pub-sub';
import { useAppDispatch, useAppSelector } from './use-redux-typed';
import { setAmIHost, setHostState } from '../store/features/matchSlice';

export enum HostState {
  ELECTED = 'ELECTED',
  NOT_ELECTED = 'NOT_ELECTED',
}
export function useHost() {
  const match = useAppSelector((state) => state.match.currentMatch);
  const { publish, subscribe } = usePubSub();
  const dispatch = useAppDispatch();
  const amIHost = useAppSelector((state) => state.match.amIHost);

  const syncHostState = useCallback(
    ({ amIHost, hostState }: { amIHost: boolean; hostState: HostState }) => {
      dispatch(setHostState(hostState));
      dispatch(setAmIHost(amIHost));
      amIHost &&
        gameSocket.sendMatchState(
          match.match_id,
          SOCKET_OP_CODES.HOST_STATE,
          hostState
        );
    },
    [dispatch, match]
  );

  subscribe({
    event: SOCKET_SYNC.HOST_STATE,
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
  }, [dispatch, match, syncHostState]);

  // Cleanup
  useEffect(() => {
    return () => {
      setHostState(HostState.NOT_ELECTED);
    };
  }, []);
}
