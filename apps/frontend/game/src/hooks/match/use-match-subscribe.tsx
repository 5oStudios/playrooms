import { useAppSelector } from '../use-redux-typed';
import { useSubscribeIf } from '@kingo/events';
import { MatchState } from '../../store/features/matchSlice';

export const useMatchSubscribe = () => {
  const _matchState = useAppSelector((state) => state.match.currentMatchState);

  const useSubscribeIfMatch = (
    matchState: MatchState,
    event: string,
    callback: (data: unknown) => void
  ) => {
    useSubscribeIf(_matchState === matchState, event, callback);
  };

  return {
    useSubscribeIfMatch,
  };
};
