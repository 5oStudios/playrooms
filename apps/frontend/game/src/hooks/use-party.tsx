'use client';
import React, { useEffect } from 'react';
import { MatchmakerTicket, PartyMatchmakerTicket } from '@heroiclabs/nakama-js';
import { useAppDispatch, useAppSelector } from './use-redux-typed';
import { MatchmakerMatched } from '@heroiclabs/nakama-js/socket';
import { useRouter } from 'next/navigation';
import { gameSocket } from '@kingo/game-client';
import { setMatchFoundData } from '../store/features/matchSlice';
import {
  LobbyMode,
  PartyOpCodes,
  PartyState,
} from '../components/lobby/lobby-actions/joinLobby';
import { SocketState } from '../store/features/socketSlice';
import {
  NODE_ENV,
  NODE_ENV_STATE,
} from '../../../../../libs/game-client/src/lib/config';

export default function useParty({
  partyId,
  partyMode,
}: {
  partyId?: string;
  partyMode: LobbyMode;
}) {
  const [partyState, setPartyState] = React.useState(PartyState.NOT_IN_QUEUE);
  const socketState = useAppSelector((state) => state.socket);
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

  useEffect(() => {
    if (partyId && socketState === SocketState.CONNECTED) {
      gameSocket.joinParty(partyId).catch((party) => {
        console.error(party);
      });
    }
  }, [partyId, socketState]);

  useEffect(() => {
    if (matched) {
      const interval = setInterval(() => {
        if (countdown === 0) {
          clearInterval(interval);
          router.push(
            `/games/trivia/match?ticket=${matched.ticket}&token=${matched.token}`
          );
        }
        setCountdown((prev) => (prev !== 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [matched, countdown, router]);

  gameSocket.onmatchmakermatched = (matched) => {
    console.info('Received MatchmakerMatched message: ', matched);
    console.info('Matched opponents: ', matched.users);
    setPartyState(PartyState.MATCH_FOUND);
    setMatched(matched);

    dispatch(setMatchFoundData(matched));
  };

  gameSocket.onpartydata = (partyData) => {
    const decodedData = new TextDecoder().decode(partyData.data);
    switch (partyData.op_code) {
      case PartyOpCodes.QUEUE_STATE:
        switch (decodedData) {
          case PartyState.IN_QUEUE:
            setPartyState(PartyState.IN_QUEUE);
            break;
          case PartyState.NOT_IN_QUEUE:
            setPartyState(PartyState.NOT_IN_QUEUE);
            break;
        }
        break;
      default:
        throw new Error(`Unknown party data op code: ${partyData.op_code}`);
    }
  };

  const handleCancelQueue = () => {
    switch (partyMode) {
      case LobbyMode.SOLO:
        gameSocket.removeMatchmaker(queueTicket.ticket).then(() => {
          setPartyState(PartyState.NOT_IN_QUEUE);
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
              PartyState.NOT_IN_QUEUE
            );
            setPartyState(PartyState.NOT_IN_QUEUE);
          });
        break;
      case LobbyMode.TOURNAMENT:
        throw new Error('Tournament mode not implemented');
    }
  };

  return {
    partyState,
    setPartyState,
    queueTicket,
    setQueueTicket,
    handleCancelQueue,
    countdown,
  };
}
