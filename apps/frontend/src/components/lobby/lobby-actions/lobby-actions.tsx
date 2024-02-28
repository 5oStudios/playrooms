import { SoloMode } from './solo-mode';
import PartyMode from './party-mode';

export enum LobbyMode {
  SOLO = 'solo',
  PARTY = 'party',
  TOURNAMENT = 'tournament',
}
export default function LobbyActions({ mode: lobbyMode = LobbyMode.SOLO }) {
  switch (lobbyMode) {
    case LobbyMode.SOLO:
      return <SoloMode />;
    case LobbyMode.PARTY:
      return <PartyMode />;
    case LobbyMode.TOURNAMENT:
      throw new Error('Tournament mode not implemented');
  }
}
