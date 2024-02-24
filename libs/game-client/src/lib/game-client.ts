import { Client, Session, Socket } from '@heroiclabs/nakama-js';
import {
  AUTO_REFRESH_SESSION,
  HOST,
  PORT,
  SERVER_KEY,
  TIMEOUT,
  USE_SSL,
} from './config';
import { nanoid } from 'nanoid';

export const PLATFORM_NAME = 'platform_name';
export const LOCAL_STORAGE_SESSION_KEY =
  PLATFORM_NAME + '_LOCAL_STORAGE_SESSION_KEY';

class GameClient {
  private readonly client: Client;
  private socket: Socket | undefined;
  private session: Session | null = null;
  constructor() {
    this.client = new Client(
      SERVER_KEY,
      HOST,
      PORT,
      USE_SSL,
      TIMEOUT,
      AUTO_REFRESH_SESSION
    );
  }

  async authenticateDevice({
    username,
    avatarUrl = '',
    avatarConfig = '',
    vars,
  }: {
    username: string;
    avatarUrl?: string;
    avatarConfig?: string;
    vars?: Record<string, string>;
  }): Promise<PlayerSession> {
    const id = this.generateId();
    const create = true;
    const session = await this.client.authenticateDevice(id, create, username, {
      avatarUrl,
      avatarConfig,
      ...vars,
    });
    this.updateSession(session);

    return session as PlayerSession;
  }

  getSessionFromLocalStorage(): PlayerSession | null {
    if (!localStorage) {
      console.warn('Local storage is not available');
      return null;
    }
    const session = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
    if (session) {
      return JSON.parse(session);
    }

    return null;
  }

  async createParty(open: boolean, maxPlayers: number) {
    const session = this.getSessionFromLocalStorage() ?? this.session;
    if (!session) {
      throw new Error('Session not found');
    }
    const socket = this.client.createSocket();
    await socket.connect(session, true);
    return await socket.createParty(open, maxPlayers);
  }

  async joinParty(partyId: string) {
    const session = this.getSessionFromLocalStorage() ?? this.session;
    if (!session) {
      throw new Error('Session not found');
    }
    const socket = this.client.createSocket();
    await socket.connect(session, true);
    return await socket.joinParty(partyId);
  }

  async updateSession(session: Session) {
    this.saveSessionInLocalStorage(session);
    this.session = session;
    await this.updateSocketConnection();
  }

  private async updateSocketConnection() {
    if (this.socket) {
      this.socket.disconnect(true);
    }
    const session = this.getSessionFromLocalStorage() ?? this.session;
    if (!session) {
      throw new Error('Session not found');
    }
    const socket = this.client.createSocket();
    await socket.connect(session, true);
    this.socket = socket;
  }

  private async refreshSession() {
    const session = this.getSessionFromLocalStorage();
    if (session) {
      const newSession = await this.client.sessionRefresh(session);
      this.updateSession(newSession);
    }
  }

  private generateId(): string {
    return 'device-' + nanoid(16);
  }

  private saveSessionInLocalStorage(session: Session) {
    localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(session));
  }
}

export const gameClient = new GameClient();
export type PlayerSession = Session & {
  vars: {
    avatarConfig: string;
    avatarUrl: string;
  };
};
