import { useCallback, useEffect } from 'react';
import { publish, useSubscribe, useSubscribeIf } from '@kingo/events';
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
import { PlayerState } from '../../store/features/playersSlice';

export const useMatchState = () => {
  const dispatch = useAppDispatch();
  const matchSate = useAppSelector((state) => state.match.currentMatchState);
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const hostState = useAppSelector((state) => state.match.hostState);
  const amIPlaying = useAppSelector((state) => {
    const myPlayer = state.players.find(
      (player) => player.user_id === state.session.user_id
    );
    return myPlayer?.state === PlayerState.READY;
  });
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
        publish('match_started');
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

  useSubscribeIf(isMatchReady, HOST_COMMANDS.START_MATCH, () => {
    if (isMatchReady) syncMatchState(MatchState.STARTED);
    else console.log('Match is not ready');
  });
  useSubscribe('match_created', () => syncMatchState(MatchState.LOADING));
  useSubscribe('match_joined', (isJoined: boolean) => {
    isJoined
      ? syncMatchState(MatchState.LOADING)
      : syncMatchState(MatchState.NOT_FOUND);
  });

  useSubscribe(SOCKET_SYNC.MATCH_STATE, syncMatchState);
  // useSubscribe({
  //   event: PlayerStateEventsKey,
  //   callback: (playerState: PlayerState) => {
  //     if (playerState === PlayerState.NOT_READY && didMatchStart)
  //       syncMatchState(MatchState.PAUSED);
  //   },
  // });
  useSubscribe(
    // Todo: if host left then this will not run
    SOCKET_SYNC.HOST_STATE,
    (hostState: HostState) => {
      if (hostState === HostState.NOT_ELECTED && didMatchStart) {
        syncMatchState(MatchState.PAUSED);
      }
    }
  );
  useSubscribeIf(amIHost, QuestionsFinishedEventKey, () =>
    syncMatchState(MatchState.ENDED)
  );
  // // Todo: this should be for non-playing users
  // useSubscribeIf(true, 'is_still_playing', () => {
  //   console.log('Game is running');
  //   syncMatchState(MatchState.STARTED);
  // });
};
