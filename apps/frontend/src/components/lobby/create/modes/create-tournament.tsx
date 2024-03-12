'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '../../../../hooks/use-redux-typed';
import { Controller, useForm } from 'react-hook-form';
import BaseModal from '../../../modals/base.modal';
import {
  Autocomplete,
  AutocompleteItem,
  BreadcrumbItem,
  Breadcrumbs,
  Button,
  Checkbox,
  Divider,
  Input,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import React, { useEffect } from 'react';
import { MockedQuestionsCollections } from '../../../../../mocks';
import { ExternalPlatformsModal } from '../../../modals/external-platforms';
import { gameSocket } from '@core/game-client';
import {
  LobbyMode,
  lobbyModeSearchParamKey,
} from '../../lobby-actions/joinLobby';

enum TournamentType {
  Public = 'public',
  Private = 'private',
}
export const tournamentIdSearchParamKey = 'tournamentId';
export interface TournamentFormData {
  questionsCollectionId: string;
  tournamentTitle: string;
  maxPlayers: string;
  externalPlatforms: {
    id: string;
    label: string;
    username: string;
  }[];
  allowThisPlatform: boolean;
}

export default function CreateTournamentStaticModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure({
    defaultOpen: true,
  });
  const router = useRouter();
  const dispatch = useAppDispatch();
  const path = usePathname();
  const [isExternalPlatformsModalOpen, setIsExternalPlatformsModalOpen] =
    React.useState(false);

  const createTournamentData = useForm<TournamentFormData>({
    defaultValues: {
      questionsCollectionId: '',
      tournamentTitle: '',
      maxPlayers: '4',
      externalPlatforms: [],
      allowThisPlatform: true,
    },
  });

  console.log('createTournamentData', createTournamentData.getValues());
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

  const handleCreateTournament = async (data: TournamentFormData) => {
    gameSocket.createMatch(data.tournamentTitle).then((match) => {
      const newPath = path.replace('create', 'join');
      const params = new URLSearchParams(newPath);
      params.append(tournamentIdSearchParamKey, match.match_id);
      params.append(lobbyModeSearchParamKey, LobbyMode.TOURNAMENT.toString());
      router.push(newPath);
    });
    // gameSocket.createMatch(data);
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
        isOpen={isOpen}
        closeButton={
          <>
            <div className={'flex self-start'}>
              <Breadcrumbs variant={'solid'}>
                <BreadcrumbItem href={'/games'}>Games</BreadcrumbItem>
                <BreadcrumbItem href={'/games/trivia'}>Trivia</BreadcrumbItem>
                <BreadcrumbItem href={'/games/trivia/create'}>
                  Create
                </BreadcrumbItem>
                <BreadcrumbItem href={'/games/trivia/create/tournament'}>
                  Tournament
                </BreadcrumbItem>
              </Breadcrumbs>
            </div>
          </>
        }
      >
        <form
          onSubmit={createTournamentData.handleSubmit(handleCreateTournament)}
        >
          <ModalContent className={'gap-4 w-full'}>
            <ModalHeader>Create Tournament</ModalHeader>
            <Controller
              name="tournamentTitle"
              control={createTournamentData.control}
              rules={{
                required: {
                  value: true,
                  message: 'Tournament Title is required',
                },
              }}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Title"
                  placeholder="My Tournament"
                  className={'w-full'}
                  errorMessage={fieldState.error?.message}
                />
              )}
            />

            <Controller
              control={createTournamentData.control}
              name="questionsCollectionId"
              rules={{
                required: {
                  value: true,
                  message: 'Questions Collection is required',
                },
              }}
              render={({ field, fieldState }) => (
                <Autocomplete
                  {...field}
                  label="Questions Collection"
                  placeholder="Select a questions collection"
                  errorMessage={fieldState.error?.message}
                  isRequired={true}
                  onSelectionChange={field.onChange}
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
            <h2 className={'self-start font-semibold'}>Allowed Platforms</h2>

            {createTournamentData
              .getValues('externalPlatforms')
              .map((platform, index: number) => (
                <div key={index} className={'w-full'}>
                  <h4>{platform.id}</h4>
                  <h3 className={'text-lg'}>{platform.label}</h3>
                  <p>Username: {platform.username}</p>
                </div>
              ))}
            <Controller
              control={createTournamentData.control}
              name="allowThisPlatform"
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  defaultSelected
                  onChange={onChange}
                  isSelected={value}
                  color={'default'}
                  className={'self-start'}
                >
                  Allow this platform
                </Checkbox>
              )}
            />
            <Button
              disableRipple
              className={'w-full'}
              onClick={() => setIsExternalPlatformsModalOpen(true)}
            >
              Add External Platforms
            </Button>
            <Divider />
            <Button
              disableRipple
              type={'submit'}
              className={'w-full'}
              size={'lg'}
              color={'secondary'}
            >
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
