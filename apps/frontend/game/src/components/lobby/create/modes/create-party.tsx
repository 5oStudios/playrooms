import React from 'react';

import {
  Button,
  Input,
  ModalContent,
  Radio,
  RadioGroup,
} from '@nextui-org/react';
import { usePathname, useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';

import { gameSocket } from '@kingo/game-client';

import { useAppDispatch } from '../../../../hooks/use-redux-typed';
import { setParty } from '../../../../lib/features/partySlice';
import BaseModal from '../../../modals/base.modal';
import {
  LobbyMode,
  lobbyModeSearchParamKey,
  partyIdSearchParamKey,
} from '../../lobby-actions/joinLobby';

enum PartyType {
  Public = 'public',
  Private = 'private',
}

export default function CreatePartyModal({
  createPartyModal,
  setCreatePartyModal,
}: {
  createPartyModal: boolean;
  setCreatePartyModal: (value: boolean) => void;
}) {
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
    >
      <form onSubmit={createPartyData.handleSubmit(handleCreateParty)}>
        <ModalContent className={'gap-4 w-full'}>
          <Controller
            name={'partyType'}
            control={createPartyData.control}
            rules={{ required: true }}
            render={({ field }) => (
              <RadioGroup
                label="Party Type"
                color="secondary"
                orientation="horizontal"
                className={'w-full'}
                defaultValue={PartyType.Public}
                {...field}
              >
                <Radio value={PartyType.Public}>Public</Radio>
                <Radio value={PartyType.Private}>Private</Radio>
              </RadioGroup>
            )}
          />

          <Controller
            name="maxPlayers"
            rules={{
              required: true,
              min: {
                value: 2,
                message: 'Minimum players is 2',
              },
              max: {
                value: 256,
                message: 'Maximum players is 256',
              },
            }}
            control={createPartyData.control}
            render={({ field, fieldState, formState }) => (
              <Input
                type="number"
                {...field}
                label="Max Players"
                placeholder="4"
                className={'w-full'}
                errorMessage={fieldState.error?.message}
              />
            )}
          />

          <Button disableRipple type={'submit'} className={'w-full'}>
            Create Party
          </Button>
        </ModalContent>
      </form>
    </BaseModal>
  );
}
