import { useAppDispatch, useAppSelector } from './use-redux-typed';
import { createParty, joinParty } from '../store/features/partySlice';
import { usePlayer } from './use-player';

export const useParty = () => {
  const { session } = usePlayer();
  const dispatch = useAppDispatch();
  const party = useAppSelector((state) => state.party);
  // gameClient.socket.onpartypresence = (presence) => {
  //   presence.joins &&
  //     presence.joins.forEach((join) => {
  //       toast.success(`${join.username} joined the party`);
  //       dispatch(setParty({ ...party, presences: [...party.presences, join] }));
  //     });
  //   presence.leaves &&
  //     presence.leaves.forEach((leave) => {
  //       toast.error(`${leave.username} left the party`);
  //       dispatch(
  //         setParty({
  //           ...party,
  //           presences: party.presences.filter(
  //             (p) => p.session_id !== leave.session_id
  //           ),
  //         })
  //       );
  //     });
  // };

  // gameClient
  //   .getUsers(
  //     session,
  //     party.presences.map((p) => p.user_id)
  //   )
  //   .then((accounts) => {
  //     console.log('accounts', accounts);
  //   });

  // gameClient.socket.onpartydata = (party) => {
  //   console.log('party data');
  //   console.log(party);
  // };
  //
  // gameClient.socket.onparty = (party) => {
  //   console.log('party');
  //   console.log(party);
  // };
  //
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
