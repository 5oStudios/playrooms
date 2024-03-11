import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '../../../../hooks/use-redux-typed';
import { Controller, useForm } from 'react-hook-form';
import BaseModal from '../../../modals/base.modal';
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Divider,
  Input,
  ModalContent,
  ModalHeader,
} from '@nextui-org/react';
import React, { useEffect } from 'react';
import { MockedQuestionsCollections } from '../../../../../mocks';
import { ExternalPlatformsModal } from '../../../modals/external-platforms';

enum TournamentType {
  Public = 'public',
  Private = 'private',
}

export default function CreateTournamentModal({
  createTournamentModal,
  setCreateTournamentModal,
}: {
  createTournamentModal: boolean;
  setCreateTournamentModal: (value: boolean) => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const path = usePathname();
  const [isExternalPlatformsModalOpen, setIsExternalPlatformsModalOpen] =
    React.useState(false);
  const createTournamentData = useForm({
    defaultValues: {
      questionsCollectionId: '',
      maxPlayers: '4',
      externalPlatforms: [],
    },
  });

  // Clean up
  useEffect(() => {
    return () => {
      createTournamentData.reset();
    };
  }, [createTournamentData]);

  const supportedPlatforms = [
    {
      id: '2',
      title: 'TikTok',
      logo: 'https://www.tiktok.com/favicon.ico',
      description: 'Allow players to join from Live Stream',
      active: true,
      external: true,
    },
    {
      id: '3',
      title: 'YouTube',
      logo: 'https://www.youtube.com/favicon.ico',
      description: 'Allow players to join from Live Stream',
      active: false,
      external: true,
    },
    {
      id: '4',
      title: 'Twitch',
      logo: 'https://www.twitch.tv/favicon.ico',
      description: 'Allow players to join from Live Stream',
      active: false,
      external: true,
    },
  ];

  const handleCreateTournament = async () => {
    console.log(
      'createTournamentData.getValues()',
      createTournamentData.getValues()
    );
    // const { maxPlayers, partyType } = createTournamentData.getValues();
    // gameSocket
    //   .createParty(partyType === TournamentType.Public, Number(maxPlayers))
    //   .then((party) => {
    //     dispatch(setTournament(party));
    //     setCreateTournamentModal(false);
    //
    //     const newPath = path.replace('create', 'join');
    //
    //     const params = new URLSearchParams(window.location.search);
    //     params.append(partyIdSearchParamKey, party.party_id);
    //     params.append(lobbyModeSearchParamKey, LobbyMode.PARTY.toString());
    //
    //     router.push(newPath + '?' + params.toString());
    //   });
  };
  return (
    <>
      <BaseModal
        size={'lg'}
        isOpen={createTournamentModal}
        onClose={() => setCreateTournamentModal(false)}
      >
        <form
          onSubmit={createTournamentData.handleSubmit(handleCreateTournament)}
        >
          <ModalContent className={'gap-4 w-full'}>
            <ModalHeader>Create Tournament</ModalHeader>
            <Controller
              control={createTournamentData.control}
              name="questionsCollectionId"
              render={({ field, fieldState }) => (
                <Autocomplete
                  {...field}
                  label="Questions Collection"
                  placeholder="Select a questions collection"
                  errorMessage={fieldState.error?.message}
                >
                  {MockedQuestionsCollections.data.map((collection) => (
                    <AutocompleteItem key={collection.id} value={collection.id}>
                      {collection.title}
                    </AutocompleteItem>
                  ))}
                </Autocomplete>
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
              control={createTournamentData.control}
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
            <Divider />
            {createTournamentData
              .getValues()
              .externalPlatforms.map((platform: any, index: number) => (
                <div key={index} className={'w-full'}>
                  <h4>{platform.id}</h4>
                  <h3 className={'text-lg'}>{platform.label}</h3>
                  <p>Username: {platform.username}</p>
                </div>
              ))}

            <Button
              disableRipple
              className={'w-full'}
              onClick={() => setIsExternalPlatformsModalOpen(true)}
            >
              Add External Platforms
            </Button>
            <Divider />
            <Button disableRipple type={'submit'} className={'w-full'}>
              Create Tournament
            </Button>
          </ModalContent>
        </form>
      </BaseModal>
      <ExternalPlatformsModal
        isOpen={isExternalPlatformsModalOpen}
        parentForm={createTournamentData}
        onClose={() => setIsExternalPlatformsModalOpen(false)}
        supportedPlatforms={supportedPlatforms}
      />
    </>
  );
}
