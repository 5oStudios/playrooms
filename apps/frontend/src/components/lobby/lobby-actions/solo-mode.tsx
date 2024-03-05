import React from 'react';
import { Button, Divider } from '@nextui-org/react';
import { gameSocket } from '@core/game-client';
import { useRouter } from 'next/navigation';
import { LobbyState } from './lobby-actions';
import { MatchmakerTicket, PartyMatchmakerTicket } from '@heroiclabs/nakama-js';

export const SoloMode = ({
  setLobbyState,
  setQueueTicket,
}: {
  setLobbyState: (lobbyState: LobbyState) => void;
  setQueueTicket: (ticket: MatchmakerTicket | PartyMatchmakerTicket) => void;
}) => {
  const handleJoinOnline = () => {
    setLobbyState(LobbyState.IN_QUEUE);
    gameSocket.addMatchmaker('*', 2, 16).then((ticket) => {
      setQueueTicket(ticket);
    });
  };
  const router = useRouter();

  return (
    <>
      <Button onClick={handleJoinOnline} size={'lg'} className={'w-full'}>
        Join Online
      </Button>
      <div className={'flex flex-row w-full gap-3'}>
        <Button disabled className={'flex-1 disabled:opacity-50'}>
          Solo
        </Button>
        <Button
          onClick={() => {
            router.push(window.location.pathname + '/party/');
          }}
          className={'w-2/3'}
        >
          Create Party
        </Button>
      </div>
      <Divider />
      <div className={'flex flex-row-reverse w-full gap-3'}>
        <Button
          // onClick={() => setCreatePartyModal(false)}
          className={'w-full'}
        >
          TikTok Mode
        </Button>
        <Button disabled className={'disabled:opacity-50 w-full'}>
          Tournament
        </Button>
      </div>
    </>
  );
};
