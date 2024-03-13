'use client';
import { useEffect } from 'react';
import { gameSocket } from '@core/game-client';
import { usePubSub } from './use-pub-sub';
import { QuestionsFinishedEventKey } from './use-questions';
import { useAppDispatch, useAppSelector } from './use-redux-typed';
import {
  MatchState,
  setCurrentMatch,
  setCurrentMatchState,
} from '../store/features/matchSlice';
import { SocketState } from '../store/features/socketSlice';
import { MatchOpCodes } from '../components/match/match';
import { HostEventsKey, HostState } from './use-host';
import { PlayerStateEventsKey } from './use-player';
import { PlayerState } from '../store/features/playerSlice';

export const MatchStateEventsKey = 'match_events';

export function useMatch() {
  const { publish, subscribe } = usePubSub();
  const socket = useAppSelector((state) => state.socket);
  const match = useAppSelector((state) => state.match.currentMatch);
  const dispatch = useAppDispatch();

  useMatchState();

  useEffect(() => {
    if (socket !== SocketState.CONNECTED) {
      console.log('Socket not connected');
      return;
    }
  }, [socket]);
  // Cleanup
  useEffect(() => {
    return () => {
      match &&
        gameSocket
          .leaveMatch(match.match_id)
          .then(() => dispatch(setCurrentMatch(null)));
    };
  }, [dispatch, match]);

  return {
    matchState: useAppSelector((state) => state.match.currentMatchState),
    createMatch: async (name: string) => {
      try {
        const match = await gameSocket.createMatch(name);
        if (match) {
          dispatch(setCurrentMatch(match));
          publish('match_created', true);
        }
        return match;
      } catch (error) {
        console.error('Error creating match', error);
      }
    },
    joinMatch: async ({ matchId, ticket, token }: JoinMatchProps) => {
      if (match) return;
      try {
        gameSocket
          .joinMatch(matchId || ticket, token)
          .then((match) => {
            console.log('Joined match with id: ', matchId, match);
            dispatch(setCurrentMatch(match));
            publish('match_joined', true);
          })
          .catch((error) => {
            console.error('Error joining match with id: ', matchId, error);
            publish('match_joined', false);
          });
      } catch (error) {
        console.error('Error joining match', error);
      }
    },
  };
}

export interface JoinMatchProps {
  matchId?: string;
  ticket?: string;
  token?: string;
}

const useMatchState = () => {
  const matchSate = useAppSelector((state) => state.match.currentMatchState);
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const hostState = useAppSelector((state) => state.match.hostState);
  const playerState = useAppSelector((state) => state.player.myPlayerState);
  const match = useAppSelector((state) => state.match.currentMatch);
  const { subscribe } = usePubSub();
  const dispatch = useAppDispatch();

  const didMatchStart = matchSate === MatchState.STARTED;
  const didMatchEnd = matchSate === MatchState.ENDED;
  const isMatchReady = matchSate === MatchState.READY;
  const isMatchNotFount = matchSate === MatchState.NOT_FOUND;
  const isPlayerReady = playerState === PlayerState.READY;
  const isHostElected = hostState === HostState.ELECTED;

  if (isPlayerReady && isHostElected && !didMatchStart)
    syncMatchState(MatchState.READY);

  subscribe({
    event: 'host_requested_start',
    callback: () => {
      console.log('Host requested start');
      if (isMatchReady) syncMatchState(MatchState.STARTED);
      else {
        console.log('isMatchReady', isMatchReady);
        console.log('isPlayerReady', isPlayerReady);
        console.log('isHostElected', isHostElected);
      }
    },
  });

  subscribe({
    event: 'match_created',
    callback: () => syncMatchState(MatchState.LOADING),
  });

  subscribe({
    event: 'match_joined',
    callback: (isJoined: boolean) => {
      isJoined
        ? syncMatchState(MatchState.LOADING)
        : syncMatchState(MatchState.NOT_FOUND);
    },
  });

  subscribe({
    event: PlayerStateEventsKey,
    callback: (playerState: PlayerState) => {
      if (playerState === PlayerState.NOT_READY && didMatchStart)
        syncMatchState(MatchState.PAUSED);
    },
  });

  subscribe({
    event: HostEventsKey,
    callback: (hostState: HostState) => {
      if (hostState === HostState.NOT_ELECTED && didMatchStart) {
        syncMatchState(MatchState.PAUSED);
      }
    },
  });

  subscribe({
    event: QuestionsFinishedEventKey,
    callback: () => syncMatchState(MatchState.ENDED),
  });

  function syncMatchState(newMatchState: MatchState) {
    if (didMatchEnd || isMatchNotFount) return;
    dispatch(setCurrentMatchState(newMatchState));
    amIHost &&
      gameSocket.sendMatchState(
        match?.match_id,
        MatchOpCodes.MATCH_STATE,
        newMatchState
      );
  }
};

export const createMatchEventKey = 'createMatch';
