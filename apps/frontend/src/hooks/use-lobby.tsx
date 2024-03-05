import React, { useEffect } from 'react';
import { MatchmakerTicket, PartyMatchmakerTicket } from '@heroiclabs/nakama-js';
import { useAppDispatch, useAppSelector } from './use-redux-typed';
import {
  NODE_ENV,
  NODE_ENV_STATE,
} from '../../../../libs/game-client/src/lib/config';
import { MatchmakerMatched } from '@heroiclabs/nakama-js/socket';
import { useRouter } from 'next/navigation';
import { gameSocket } from '@core/game-client';
import { setMatchFoundData } from '../store/features/matchSlice';
import {
  LobbyMode,
  LobbyState,
  PartyOpCodes,
} from '../components/lobby/lobby-actions/lobby';

export default function useLobby({ lobbyMode }: { lobbyMode: LobbyMode }) {
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
            `/games/trivia/match?ticket=${matched.ticket}&token=${matched.token}`
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

  return {
    lobbyState,
    setLobbyState,
    queueTicket,
    setQueueTicket,
    handleCancelQueue,
    countdown,
  };
}
