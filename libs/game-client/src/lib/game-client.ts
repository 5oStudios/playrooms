import { Client, Session, Socket } from '@heroiclabs/nakama-js';
import {
  AUTO_REFRESH_SESSION,
  HOST,
  PORT,
  SERVER_KEY,
  TIMEOUT,
  USE_SSL,
} from './config';

export const PLATFORM_NAME = 'platform_name';
export const LOCAL_STORAGE_AUTH_KEY = PLATFORM_NAME + '_LOCAL_STORAGE_AUTH_KEY';
export const LOCAL_STORAGE_REFRESH_KEY =
  PLATFORM_NAME + '_LOCAL_STORAGE_REFRESH_KEY';

class GameClient extends Client implements Client {
  // private readonly client: Client;
  public socket: Socket | undefined;
  private session: Session | null = null;

  constructor() {
    super(SERVER_KEY, HOST, PORT, USE_SSL, TIMEOUT, AUTO_REFRESH_SESSION);
  }

  // override async authenticateDevice({
  //   username,
  //   avatarUrl = '',
  //   avatarConfig = '',
  //   vars,
  // }: {
  //   username: string;
  //   avatarUrl?: string;
  //   avatarConfig?: string;
  //   vars?: Record<string, string>;
  // }): Promise<PlayerSession> {
  //   const id = this.generateId();
  //   const create = true;
  //   const session = (await super.authenticateDevice(id, create, username, {
  //     avatarUrl,
  //     avatarConfig,
  //     ...vars,
  //   })) as PlayerSession;
  //   await this.updateSession(session);
  //   await this.initSocket();
  //
  //   console.log('session', session);
  //   console.log('account', await this.getAccount(session));
  //
  //   return session as PlayerSession;
  // }

  // public async getSessionFromLocalStorage(): Promise<PlayerSession | null> {
  //   if (!localStorage) {
  //     console.warn('Local storage is not available');
  //     return null;
  //   }
  //   const session = localStorage.getItem(LOCAL_STORAGE_SESSION_KEY);
  //   return Session.restore() as PlayerSession;
  // }
  //
  // public async createParty(open: boolean, maxPlayers: number) {
  //   const session = this.getSessionFromLocalStorage() ?? this.session;
  //   if (!session) {
  //     throw new Error('Session not found');
  //   }
  //   // const socket = super.createSocket();
  //   // await socket.connect(session, true);
  //   return await this.socket.createParty(open, maxPlayers);
  // }
  //
  // public async joinParty(partyId: string) {
  //   if (!this.socket) await this.initSocket();
  //   const session = this.getSessionFromLocalStorage() ?? this.session;
  //   if (!session) {
  //     throw new Error('Session not found');
  //   }
  //   if (!this.socket) throw new Error('Socket not found');
  //   return await this.socket.joinParty(partyId);
  // }
  //
  // private async initSocket() {
  //   const session = this.getSessionFromLocalStorage() ?? this.session;
  //   if (!session) {
  //     throw new Error('Session not found');
  //   }
  //   const socket = super.createSocket();
  //   await socket.connect(session, true);
  //   this.socket = socket;
  // }
  //
  // private async updateSession(session: PlayerSession) {
  //   this.saveSessionInLocalStorage(session);
  //   this.session = session;
  // }
  //
  // private async updateSocketConnection() {
  //   if (this.socket) {
  //     this.socket.disconnect(true);
  //   }
  //   const session = this.getSessionFromLocalStorage() ?? this.session;
  //   if (!session) {
  //     throw new Error('Session not found');
  //   }
  //   const socket = super.createSocket();
  //   await socket.connect(session, true);
  //   this.socket = socket;
  // }
  //
  // private async refreshSession() {
  //   const session = this.getSessionFromLocalStorage();
  //   if (session) {
  //     const newSession = (await super.sessionRefresh(session)) as PlayerSession;
  //     await this.updateSession(newSession);
  //   }
  // }
  //
  // private generateId(): string {
  //   return 'device-' + nanoid(16);
  // }
  //
  // private saveSessionInLocalStorage(session: PlayerSession) {
  //   localStorage.setItem(LOCAL_STORAGE_SESSION_KEY, JSON.stringify(session));
  // }
}

export const gameClient = new GameClient();
export const gameSocket = gameClient.createSocket();
