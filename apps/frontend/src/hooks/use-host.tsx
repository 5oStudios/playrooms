'use client';
import { useEffect, useState } from 'react';
import { MatchData } from '@heroiclabs/nakama-js';
import { gameSocket } from '@core/game-client';
import { MatchOpCodes } from '../components/match/match';
import { usePubSub } from './use-pub-sub';
import { useAppSelector } from './use-redux-typed';

export enum HostState {
  ELECTED = 'ELECTED',
  NOT_ELECTED = 'NOT_ELECTED',
}
export const HostEventsKey = 'host_events';
export function useHost() {
  const match = useAppSelector((state) => state.match.currentMatch);
  const [amIHost, setAmIHost] = useState<boolean>(false);
  const [hostState, setHostState] = useState<HostState>(HostState.NOT_ELECTED);
  const { publish, subscribe } = usePubSub();

  useEffect(() => {
    if (!match) return;
    const isFirstPlayer = !match.presences;
    if (isFirstPlayer) {
      setAmIHost(true);
      setHostState(HostState.ELECTED);
      gameSocket.sendMatchState(
        match.match_id,
        MatchOpCodes.HOST_STATE,
        HostState.ELECTED
      );
    }
  }, [match]);

  // Cleanup
  useEffect(() => {
    return () => {
      setAmIHost(false);
      setHostState(HostState.NOT_ELECTED);
    };
  }, []);

  const hostSocketEventsReceiver = (matchData: MatchData) => {
    const decodedData = new TextDecoder().decode(matchData.data);
    switch (decodedData) {
      case HostState.ELECTED:
        setHostState(HostState.ELECTED);
        break;
      case HostState.NOT_ELECTED:
        setHostState(HostState.NOT_ELECTED);
        break;
    }
  };
  useEffect(() => {
    publish(HostEventsKey, hostState);
  }, [hostState, publish]);

  return {
    amIHost,
    hostSocketEventsReceiver,
  };
}
