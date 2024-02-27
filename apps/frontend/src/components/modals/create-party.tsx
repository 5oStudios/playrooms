'use client';
import React from 'react';
import {
  Button,
  Input,
  ModalContent,
  Radio,
  RadioGroup,
} from '@nextui-org/react';
import { gameSocket } from '@core/game-client';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import BaseModal from './base.modal';
import { useAppDispatch } from '../../hooks/use-redux-typed';
import { setParty } from '../../store/features/partySlice';

export const GameModeButtons = () => {
  const [createPartyModal, setCreatePartyModal] = React.useState(false);
  const router = useRouter();
  const handleJoinOnline = async () => {
    await gameSocket.joinParty('test');
  };

  enum PartyType {
    Public = 'public',
    Private = 'private',
  }

  const createPartyData = useForm({
    defaultValues: {
      maxPlayers: '4',
      partyType: PartyType.Public,
    },
  });

  const dispatch = useAppDispatch();

  const handleCreateParty = async () => {
    const { maxPlayers, partyType } = createPartyData.getValues();
    gameSocket
      .createParty(partyType === PartyType.Public, Number(maxPlayers))
      .then((party) => {
        dispatch(setParty(party));
        setCreatePartyModal(false);
        router.replace(`/join/${party.party_id}`);
      });
  };

  return (
    <>
      <Button onClick={handleJoinOnline} size={'lg'} className={'w-full'}>
        Join Online
      </Button>
      <div className={'flex flex-row w-full gap-3'}>
        <Button className={'flex-1'}>Offline</Button>
        <Button onClick={() => setCreatePartyModal(true)} className={'w-2/3'}>
          Create Party
        </Button>
      </div>

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
    </>
  );
};
