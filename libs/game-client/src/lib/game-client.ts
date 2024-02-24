import { Client, Session } from '@heroiclabs/nakama-js';
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
    vars,
  }: {
    username: string;
    vars?: Record<string, string>;
  }) {
    if (!this.session) return this.getSessionFromLocalStorage();
    else {
      const id = this.generateId();
      const create = true;
      const session = await this.client.authenticateDevice(
        id,
        create,
        username,
        vars
      );
      this.updateSession(session);

      return session;
    }
  }

  getSessionFromLocalStorage(): Session | null {
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

  private updateSession(session: Session) {
    this.saveSessionInLocalStorage(session);
    this.session = session;
  }
}

export const gameClient = new GameClient();
