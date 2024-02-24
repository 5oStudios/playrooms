import { useAppDispatch, useAppSelector } from './use-redux-typed';
import { createParty, joinParty } from '../store/features/partySlice';

export const useParty = () => {
  const dispatch = useAppDispatch();

  return {
    createParty: (party: { open: boolean; maxPlayers: number }) =>
      dispatch(createParty(party)),
    party: useAppSelector((state) => state.party),
    joinParty: (partyId: string) => dispatch(joinParty(partyId)),
  };
};
