import { SoloMode } from './solo-mode';
import PartyMode from './party-mode';
import React, { useEffect } from 'react';
import { gameSocket } from '@core/game-client';
import { setMatchFoundData } from '../../../store/features/matchSlice';
import { useAppDispatch, useAppSelector } from '../../../hooks/use-redux-typed';
import { Button } from '@nextui-org/react';
import { MatchmakerTicket, PartyMatchmakerTicket } from '@heroiclabs/nakama-js';
import { MatchmakerMatched } from '@heroiclabs/nakama-js/socket';
import { useRouter } from 'next/navigation';
import {
  NODE_ENV,
  NODE_ENV_STATE,
} from '../../../../../../libs/game-client/src/lib/config';

export enum LobbyMode {
  SOLO,
  PARTY,
  TOURNAMENT,
}

export enum PartyOpCodes {
  QUEUE_STATE = 100,
}

export enum LobbyState {
  IN_QUEUE = 'IN_QUEUE',
  NOT_IN_QUEUE = 'NOT_IN_QUEUE',
  MATCH_FOUND = 'MATCH_FOUND',
}
export default function LobbyActions({ mode: lobbyMode = LobbyMode.SOLO }) {
  const [lobbyState, setLobbyState] = React.useState(LobbyState.NOT_IN_QUEUE);
  const [queueTicket, setQueueTicket] = React.useState<
    MatchmakerTicket | PartyMatchmakerTicket | null
  >(null);
  const dispatch = useAppDispatch();
  const party = useAppSelector((state) => state.party);
  const [countdown, setCountdown] = React.useState<number | null>(() =>
    NODE_ENV === NODE_ENV_STATE.DEVELOPMENT ? 0 : 3
  );
  const [matched, setMatched] = React.useState<MatchmakerMatched | null>(null);
  const router = useRouter();

  gameSocket.onmatchmakermatched = (matched) => {
    console.info('Received MatchmakerMatched message: ', matched);
    console.info('Matched opponents: ', matched.users);
    setLobbyState(LobbyState.MATCH_FOUND);
    setMatched(matched);

    dispatch(setMatchFoundData(matched));
  };

  useEffect(() => {
    if (matched) {
      const interval = setInterval(() => {
        if (countdown === 0) {
          clearInterval(interval);
          router.push(
            `/game/trivia/match?ticket=${matched.ticket}&token=${matched.token}`
          );
        }
        setCountdown((prev) => (prev !== 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [matched, countdown, router]);

  gameSocket.onpartydata = (partyData) => {
    const decodedData = new TextDecoder().decode(partyData.data);
    switch (partyData.op_code) {
      case PartyOpCodes.QUEUE_STATE:
        switch (decodedData) {
          case LobbyState.IN_QUEUE:
            setLobbyState(LobbyState.IN_QUEUE);
            break;
          case LobbyState.NOT_IN_QUEUE:
            setLobbyState(LobbyState.NOT_IN_QUEUE);
            break;
        }
        break;
      default:
        throw new Error(`Unknown party data op code: ${partyData.op_code}`);
    }
  };

  const handleCancelQueue = () => {
    switch (lobbyMode) {
      case LobbyMode.SOLO:
        gameSocket.removeMatchmaker(queueTicket.ticket).then(() => {
          setLobbyState(LobbyState.NOT_IN_QUEUE);
        });
        break;
      case LobbyMode.PARTY:
        console.log(
          'removing party from queue',
          party.party_id,
          queueTicket.ticket
        );
        gameSocket
          .removeMatchmakerParty(party.party_id, queueTicket.ticket)
          .then(() => {
            gameSocket.sendPartyData(
              party.party_id,
              PartyOpCodes.QUEUE_STATE,
              LobbyState.NOT_IN_QUEUE
            );
            setLobbyState(LobbyState.NOT_IN_QUEUE);
          });
        break;
      case LobbyMode.TOURNAMENT:
        throw new Error('Tournament mode not implemented');
    }
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

  switch (lobbyMode) {
    case LobbyMode.SOLO:
      return (
        <SoloMode
          setLobbyState={setLobbyState}
          setQueueTicket={setQueueTicket}
        />
      );
    case LobbyMode.PARTY:
      return (
        <PartyMode
          setLobbyState={setLobbyState}
          setQueueTicket={setQueueTicket}
        />
      );
    case LobbyMode.TOURNAMENT:
      throw new Error('Tournament mode not implemented');
  }
}
