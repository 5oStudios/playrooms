import { useCallback, useEffect } from 'react';
import { subscribe, useSubscribeIf } from '@kingo/events';
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

  const isMatchStarted = matchSate === MatchState.PLAYING;
  console.log('didMatchStart', isMatchStarted);
  const didMatchEnd = matchSate === MatchState.ENDED;
  const isMatchReady = matchSate === MatchState.READY;
  const isMatchNotFount = matchSate === MatchState.NOT_FOUND;
  const isMatchPaused = matchSate === MatchState.PAUSED;
  // const isPlayerReady = playerState === PlayerState.READY;
  const isHostElected = hostState === HostState.ELECTED;

  const syncMatchState = useCallback(
    (newMatchState: MatchState) => {
      if (didMatchEnd) return;
      dispatch(setCurrentMatchState(newMatchState));
      amIHost && sendMatchState(SOCKET_OP_CODES.MATCH_STATE, newMatchState);
    },
    [amIHost, dispatch, sendMatchState, didMatchEnd]
  );

  useEffect(() => {
    if (isHostElected && !isMatchStarted && !isMatchPaused) {
      syncMatchState(MatchState.READY);
    }
  }, [isHostElected, isMatchStarted, syncMatchState, isMatchPaused]);

  !amIHost && subscribe(SOCKET_SYNC.MATCH_STATE, syncMatchState);

  useSubscribeIf(isMatchStarted, QuestionsFinishedEventKey, () =>
    syncMatchState(MatchState.ENDED)
  );
  useSubscribeIf(isMatchStarted, HOST_COMMANDS.SHOW_LEADERBOARD, () => {
    syncMatchState(MatchState.PAUSED);
  });
  useSubscribeIf(isMatchPaused, HOST_COMMANDS.HIDE_LEADERBOARD, () => {
    syncMatchState(MatchState.PLAYING);
  });
  useSubscribeIf(isMatchReady, HOST_COMMANDS.START_MATCH, () => {
    syncMatchState(MatchState.PLAYING);
  });

  subscribe('match_created', () => syncMatchState(MatchState.LOADING));
  subscribe('match_joined', (isJoined: boolean) => {
    isJoined
      ? syncMatchState(MatchState.LOADING)
      : syncMatchState(MatchState.NOT_FOUND);
  });

  // subscribe({
  //   event: PlayerStateEventsKey,
  //   callback: (playerState: PlayerState) => {
  //     if (playerState === PlayerState.NOT_READY && didMatchStart)
  //       syncMatchState(MatchState.PAUSED);
  //   },
  // });
  // subscribe(
  //   // Todo: if host left then this will not run
  //   SOCKET_SYNC.HOST_STATE,
  //   (hostState: HostState) => {
  //     if (hostState === HostState.NOT_ELECTED && didMatchStart) {
  //       syncMatchState(MatchState.PAUSED);
  //     }
  //   }
  // );

  //
  // // Cleanup
  // useEffect(() => {
  //   return () => {
  //     dispatch(setCurrentMatchState(null));
  //   };
  // }, [dispatch]);
};
