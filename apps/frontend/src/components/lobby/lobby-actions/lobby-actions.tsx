import { SoloMode } from './solo-mode';
import PartyMode from './party-mode';
import React from 'react';
import { gameSocket } from '@core/game-client';
import { setMatchFoundData } from '../../../store/features/matchSlice';
import { useAppDispatch } from '../../../hooks/use-redux-typed';

export enum LobbyMode {
  SOLO,
  PARTY,
  TOURNAMENT,
}

export enum LobbyState {
  IN_QUEUE,
  NOT_IN_QUEUE,
  MATCH_FOUND,
}
export default function LobbyActions({ mode: lobbyMode = LobbyMode.SOLO }) {
  const [lobbyState, setLobbyState] = React.useState(LobbyState.NOT_IN_QUEUE);
  const dispatch = useAppDispatch();

  gameSocket.onmatchmakermatched = (matched) => {
    console.info('Received MatchmakerMatched message: ', matched);
    console.info('Matched opponents: ', matched.users);
    setLobbyState(LobbyState.MATCH_FOUND);

    dispatch(setMatchFoundData(matched));
  };

  switch (lobbyState) {
    case LobbyState.IN_QUEUE:
      return (
        <div>
          <h1>Waiting for match</h1>
        </div>
      );
    case LobbyState.MATCH_FOUND:
      return (
        <div>
          <h1>Match found</h1>
        </div>
      );
  }

  switch (lobbyMode) {
    case LobbyMode.SOLO:
      return <SoloMode setLobbyState={setLobbyState} />;
    case LobbyMode.PARTY:
      return <PartyMode setLobbyState={setLobbyState} />;
    case LobbyMode.TOURNAMENT:
      throw new Error('Tournament mode not implemented');
  }
}
