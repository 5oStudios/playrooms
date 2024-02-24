import { useAppDispatch, useAppSelector } from './use-redux-typed';
import { createParty, joinParty } from '../store/features/partySlice';

export const useParty = () => {
  const dispatch = useAppDispatch();
  const party = useAppSelector((state) => state.party);

  return {
    party,
    createParty: (party: { open: boolean; maxPlayers: number }) =>
      dispatch(createParty(party)),
    joinParty: (partyId: string) => {
      if (!partyId) {
        console.error('No party id');
        return;
      }
      if (party.party_id) {
        console.error('Already in a party');
        return;
      }
      dispatch(joinParty(partyId));
    },
    onPartyPresence: (presence: any) => {
      console.log('onPartyPresence', presence);
    },
  };
};
