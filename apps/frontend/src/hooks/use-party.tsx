import { useAppDispatch } from './use-redux-typed';
import { createParty } from '../store/features/partySlice';

export const useParty = () => {
  const dispatch = useAppDispatch();

  return {
    createParty: (party: { open: boolean; maxPlayers: number }) =>
      dispatch(createParty(party)),
  };
};
