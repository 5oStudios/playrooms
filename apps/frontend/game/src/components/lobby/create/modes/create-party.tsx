import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { gameSocket } from '@kingo/game-client';

import {
  BaseModal,
  LobbyMode,
  lobbyModeSearchParamKey,
  partyIdSearchParamKey,
} from '@components';
import { useAppDispatch } from '@hooks';
import { setParty } from '@store';

enum PartyType {
  Public = 'public',
  Private = 'private',
}

export function CreatePartyModal({
  createPartyModal,
  setCreatePartyModal,
}: Readonly<{
  createPartyModal: boolean;
  setCreatePartyModal: (value: boolean) => void;
}>) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const path = usePathname();

  const createPartyData = useForm({
    defaultValues: {
      maxPlayers: '4',
      partyType: PartyType.Public,
    },
  });

  const handleCreateParty = async () => {
    const { maxPlayers, partyType } = createPartyData.getValues();
    gameSocket
      .createParty(partyType === PartyType.Public, Number(maxPlayers))
      .then((party) => {
        dispatch(setParty(party));
        setCreatePartyModal(false);

        const newPath = path.replace('create', 'join');

        const params = new URLSearchParams(window.location.search);
        params.append(partyIdSearchParamKey, party.party_id);
        params.append(lobbyModeSearchParamKey, LobbyMode.PARTY.toString());

        router.push(newPath + '?' + params.toString());
      });
  };
  return (
    <BaseModal
      size={'sm'}
      isOpen={createPartyModal}
      onClose={() => setCreatePartyModal(false)}
    ></BaseModal>
  );
}
