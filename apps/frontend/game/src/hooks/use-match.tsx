import { gameSocket } from '@core/game-client';
import { QuestionsFinishedEventKey } from './use-questions';
import { useAppDispatch, useAppSelector } from './use-redux-typed';
import {
  MatchState,
  setCurrentMatch,
  setCurrentMatchState,
} from '../store/features/matchSlice';
import {
  HOST_COMMANDS,
  SOCKET_OP_CODES,
  SOCKET_SYNC,
} from '../components/match/match';
import { HostState } from './use-host';
import { useCallback, useEffect } from 'react';
import { publish, subscribe } from '@kingo/events';

export const MatchStateEventsKey = 'match_events';

export interface JoinMatchProps {
  matchId?: string;
  ticket?: string;
  token?: string;
}
export function useMatch({ matchId }: { matchId?: string }) {
  const match = useAppSelector((state) => state.match.currentMatch);
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.session);

  useMatchState();

  // Cleanup
  // useEffect(() => {
  //   return () => {
  //     match &&
  //       gameSocket
  //         .leaveMatch(match.match_id)
  //         .then(() => dispatch(setCurrentMatch(null)));
  //   };
  // }, [dispatch, match]);

  // Create a flag to track whether the joinMatch function has been called
  useEffect(() => {
    if (match) {
      console.log('Player already in match');
      return;
    }
    // if (!matchId && !ticket) {
    //   console.log('matchId or ticket needed to join match, received:', {
    //     matchId,
    //     ticket,
    //   });
    //   return;
    // }
    if (matchId) {
      console.log('Joining match', matchId);
      gameSocket
        .connect(session, true)
        .then(() => {
          gameSocket
            .joinMatch(matchId)
            .then((match) => {
              publish('match_joined', true);
              console.log('Joined match', match);
              dispatch(setCurrentMatch(match));
            })
            .catch((error) => {
              publish('match_joined', false);
              console.error('Error joining match', error);
            });
        })
        .catch((error) => {
          console.error('Error connecting to socket', error);
        });
    }
  }, [dispatch, match, matchId, session]);

  return {
    createMatch: async (name: string) => {
      try {
        const match = await gameSocket.createMatch(name);
        publish('match_created', true);
        return match;
      } catch (error) {
        console.error('Error creating match', error);
      }
    },
  };
}

export const useMatchState = () => {
  const dispatch = useAppDispatch();
  const matchSate = useAppSelector((state) => state.match.currentMatchState);
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const hostState = useAppSelector((state) => state.match.hostState);
  const match = useAppSelector((state) => state.match.currentMatch);

  const didMatchStart = matchSate === MatchState.STARTED;
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
      amIHost &&
        gameSocket.sendMatchState(
          match?.match_id,
          SOCKET_OP_CODES.MATCH_STATE,
          newMatchState
        );
    },
    [amIHost, didMatchEnd, dispatch, match?.match_id]
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

export const createMatchEventKey = 'createMatch';
