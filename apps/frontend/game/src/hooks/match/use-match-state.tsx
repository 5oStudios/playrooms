import { useCallback, useEffect } from 'react';
import { publish, subscribe } from '@kingo/events';
import { useAppDispatch, useAppSelector } from '../use-redux-typed';
import {
  MatchState,
  setCurrentMatchState,
} from '../../store/features/matchSlice';
import { HostState } from '../use-host';
import { QuestionsFinishedEventKey } from '../use-questions';
import {
  SOCKET_OP_CODES,
  SOCKET_SYNC,
  useMatchSocket,
} from './use-match-socket';
import { HOST_COMMANDS } from '../../components/match/match';

export const useMatchState = () => {
  const dispatch = useAppDispatch();
  const matchSate = useAppSelector((state) => state.match.currentMatchState);
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const hostState = useAppSelector((state) => state.match.hostState);
  const { sendMatchState } = useMatchSocket();

  const didMatchStart = matchSate === MatchState.STARTED;
  console.log('didMatchStart', didMatchStart);
  const didMatchEnd = matchSate === MatchState.ENDED;
  const isMatchReady = matchSate === MatchState.READY;
  const isMatchNotFount = matchSate === MatchState.NOT_FOUND;
  // const isPlayerReady = playerState === PlayerState.READY;
  const isHostElected = hostState === HostState.ELECTED;

  const syncMatchState = useCallback(
    (newMatchState: MatchState) => {
      if (didMatchEnd) return;
      if (newMatchState === MatchState.STARTED) {
        console.log('Match started');
        console.log('amIHost', amIHost);
        publish('match_started', true);
      }
      dispatch(setCurrentMatchState(newMatchState));
      amIHost && sendMatchState(SOCKET_OP_CODES.MATCH_STATE, newMatchState);
    },
    [amIHost, didMatchEnd, dispatch, sendMatchState]
  );

  useEffect(() => {
    if (isHostElected && !didMatchStart) syncMatchState(MatchState.READY);
  }, [isHostElected, didMatchStart, syncMatchState]);

  // Cleanup
  useEffect(() => {
    return () => {
      dispatch(setCurrentMatchState(null));
    };
  }, [dispatch]);

  subscribe(HOST_COMMANDS.START_MATCH, () => {
    if (isMatchReady) syncMatchState(MatchState.STARTED);
    else console.log('Match is not ready');
  });
  subscribe('match_created', () => syncMatchState(MatchState.LOADING));
  subscribe('match_joined', (isJoined: boolean) => {
    isJoined
      ? syncMatchState(MatchState.LOADING)
      : syncMatchState(MatchState.NOT_FOUND);
  });

  subscribe(SOCKET_SYNC.MATCH_STATE, syncMatchState);
  // subscribe({
  //   event: PlayerStateEventsKey,
  //   callback: (playerState: PlayerState) => {
  //     if (playerState === PlayerState.NOT_READY && didMatchStart)
  //       syncMatchState(MatchState.PAUSED);
  //   },
  // });
  subscribe(
    // Todo: if host left then this will not run
    SOCKET_SYNC.HOST_STATE,
    (hostState: HostState) => {
      if (hostState === HostState.NOT_ELECTED && didMatchStart) {
        syncMatchState(MatchState.PAUSED);
      }
    }
  );
  subscribe(QuestionsFinishedEventKey, () => syncMatchState(MatchState.ENDED));
};
