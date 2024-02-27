import { useAppDispatch, useAppSelector } from '../../hooks/use-redux-typed';

export default function PartyPresencesToast() {
  const partyMembersAccount = useAppSelector(
    (state) => state.party.membersAccount
  );
  const dispatch = useAppDispatch();
  const session = useAppSelector((state) => state.session);

  return null;
}
