'use client';

import { Button, Divider } from '@nextui-org/react';

import { gameSocket } from '@kingo/game-client';

import useParty from '../../../hooks/use-party';
import { LobbyPartyMode } from './lobby-party-mode';

export enum LobbyMode {
  SOLO,
  PARTY,
  TOURNAMENT,
  TIKTOK,
}

export enum PartyOpCodes {
  QUEUE_STATE = 100,
}

export enum PartyState {
  IN_QUEUE = 'IN_QUEUE',
  NOT_IN_QUEUE = 'NOT_IN_QUEUE',
  MATCH_FOUND = 'MATCH_FOUND',
}

export const lobbyModeSearchParamKey = 'lobbyMode';
export const partyIdSearchParamKey = 'partyId';

export function JoinLobby({
  partyId,
  mode,
}: Readonly<{
  partyId?: string;
  mode: LobbyMode;
}>) {
  const {
    partyState,
    setPartyState,
    setQueueTicket,
    countdown,
    handleCancelQueue,
  } = useParty({ partyId, partyMode: mode });

  const handleJoinOnline = () => {
    setPartyState(PartyState.IN_QUEUE);
    gameSocket.addMatchmaker('*', 2, 16).then((ticket) => {
      setQueueTicket(ticket);
    });
  };

  switch (partyState) {
    case PartyState.IN_QUEUE:
      return (
        <>
          <h1>Waiting for match</h1>
          <Button className={'w-1/2'} onClick={handleCancelQueue}>
            Cancel
          </Button>
        </>
      );
    case PartyState.MATCH_FOUND:
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
        <LobbyPartyMode
          setPartyState={setPartyState}
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
