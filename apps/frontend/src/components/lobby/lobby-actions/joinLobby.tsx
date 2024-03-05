import PartyMode from './party-mode';
import React from 'react';
import { Button, Divider } from '@nextui-org/react';
import useLobby from '../../../hooks/use-lobby';
import { gameSocket } from '@core/game-client';

export enum LobbyMode {
  SOLO,
  PARTY,
  TOURNAMENT,
  TIKTOK,
}

export enum PartyOpCodes {
  QUEUE_STATE = 100,
}

export enum LobbyState {
  IN_QUEUE = 'IN_QUEUE',
  NOT_IN_QUEUE = 'NOT_IN_QUEUE',
  MATCH_FOUND = 'MATCH_FOUND',
}

export const lobbyModeSearchParamKey = 'lobbyMode';

export default function JoinLobby({ mode }: { mode: LobbyMode }) {
  const {
    lobbyState,
    setLobbyState,
    setQueueTicket,
    countdown,
    handleCancelQueue,
  } = useLobby({ lobbyMode: mode });

  const handleJoinOnline = () => {
    setLobbyState(LobbyState.IN_QUEUE);
    gameSocket.addMatchmaker('*', 2, 16).then((ticket) => {
      setQueueTicket(ticket);
    });
  };

  switch (lobbyState) {
    case LobbyState.IN_QUEUE:
      return (
        <>
          <h1>Waiting for match</h1>
          <Button className={'w-1/2'} onClick={handleCancelQueue}>
            Cancel
          </Button>
        </>
      );
    case LobbyState.MATCH_FOUND:
      return (
        <div className={'flex flex-col items-center text-center'}>
          <h1>Match found</h1>
          <h2>Match starts in {countdown} seconds</h2>
        </div>
      );
  }

  switch (mode) {
    case LobbyMode.PARTY:
      return (
        <PartyMode
          setLobbyState={setLobbyState}
          setQueueTicket={setQueueTicket}
        />
      );
    default:
      return (
        <>
          <Button onClick={handleJoinOnline} size={'lg'} className={'w-full'}>
            Join Online
          </Button>
          <div className={'flex flex-row w-full gap-3'}>
            <Button disabled className={'flex-1 disabled:opacity-50'}>
              Offline
            </Button>
            <Button
              href={window.location.pathname + '/party'}
              className={'w-2/3 disabled:opacity-50'}
              disabled
            >
              Join Party
            </Button>
          </div>
          <Divider />
          <div className={'flex flex-row-reverse w-full gap-3'}>
            <Button className={'w-full disabled:opacity-50'} disabled>
              Join Match
            </Button>
            <Button disabled className={'disabled:opacity-50 w-full'}>
              Join Tournament
            </Button>
          </div>
        </>
      );
  }
}
