import { useRouter } from 'next/navigation';
import { useAppDispatch } from '../../../hooks/use-redux-typed';
import { Controller, useForm } from 'react-hook-form';
import { gameSocket } from '@core/game-client';
import { setParty } from '../../../store/features/partySlice';
import BaseModal from '../../modals/base.modal';
import {
  Button,
  Input,
  ModalContent,
  Radio,
  RadioGroup,
} from '@nextui-org/react';
import React from 'react';

enum PartyType {
  Public = 'public',
  Private = 'private',
}

export default function Page({
  createPartyModal,
  setCreatePartyModal,
}: {
  createPartyModal: boolean;
  setCreatePartyModal: (value: boolean) => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();

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

        router.push(window.location.pathname + '/lobby/' + party.party_id);
      });
  };
  return (
    <BaseModal
      size={'sm'}
      isOpen={createPartyModal}
      onClose={() => setCreatePartyModal(false)}
    >
      <ModalContent className={'gap-4'}>
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
          rules={{ required: true, min: 2, max: 256 }}
          control={createPartyData.control}
          render={({ field, fieldState }) => (
            <Input
              type="number"
              {...field}
              label="Max Players"
              placeholder="4"
              className={'w-full'}
            />
          )}
        />

        <Button onClick={handleCreateParty} className={'w-full'}>
          Create Party
        </Button>
      </ModalContent>
    </BaseModal>
  );
}
