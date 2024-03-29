import { useEffect } from 'react';

import { publish } from '@kingo/events';
import { gameSocket } from '@kingo/game-client';

import { setCurrentMatch } from '../../store/features/matchSlice';
import { useAppDispatch, useAppSelector } from '../use-redux-typed';

export interface JoinMatchProps {
  matchId?: string;
  ticket?: string;
  token?: string;
}
export function useMatch({ matchId }: { matchId?: string }) {
  const match = useAppSelector((state) => state.match.currentMatch);
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.session);

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

  useEffect(() => {
    return () => {
      if (match) {
        gameSocket
          .leaveMatch(match.match_id)
          .then(() => dispatch(setCurrentMatch(null)));
      }
    };
  }, []);

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
