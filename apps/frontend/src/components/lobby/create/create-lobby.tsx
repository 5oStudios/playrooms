import React from 'react';
import { Button, Divider } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { LobbyMode, lobbyModeSearchParamKey } from '../lobby-actions/joinLobby';
import CreatePartyModal from './modes/create-party';

export const CreateLobby = () => {
  const router = useRouter();
  const [createPartyModal, setCreatePartyModal] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => {
          router.push(
            window.location.pathname +
              `?${lobbyModeSearchParamKey}=${LobbyMode.PARTY}`
          );
          setCreatePartyModal(true);
        }}
        size={'lg'}
        className={'w-full'}
      >
        Create Party
      </Button>
      <Divider />
      <div className={'flex flex-row-reverse w-full gap-3'}>
        <Button disabled className={'disabled:opacity-50 w-full'}>
          Create Match
        </Button>
        <Button
          onClick={() => {
            router.push(
              window.location.pathname +
                `?${lobbyModeSearchParamKey}=${LobbyMode.TIKTOK}`
            );
          }}
          className={'w-full'}
        >
          Tournament
        </Button>
      </div>

      <CreatePartyModal
        setCreatePartyModal={setCreatePartyModal}
        createPartyModal={createPartyModal}
      />
    </>
  );
};
