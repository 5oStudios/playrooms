import { io, Socket } from 'socket.io-client';
// import { store } from '../../../../apps/frontend/src/store/store';
// import { addMessage } from '../../../../apps/frontend/src/store/features/externalChatSlice';

export enum TikTokLiveEvents {
  ROOM_USER = 'roomUser',
  MEMBER = 'member',
  CHAT = 'chat',
  GIFT = 'gift',
  SOCIAL = 'social',
  LIKE = 'like',
  QUESTION_NEW = 'questionNew',
  LINK_MIC_BATTLE = 'linkMicBattle',
  LINK_MIC_ARMIES = 'linkMicArmies',
  LIVE_INTRO = 'liveIntro',
  EMOTE = 'emote',
  ENVELOPE = 'envelope',
  SUBSCRIBE = 'subscribe',
}
export const ListenToStreamEventKey = 'listenToStream';

export const tiktokSocket: Socket = io('localhost:4444');
tiktokSocket.connect();
tiktokSocket.on('connect', () => {
  console.log('connected to tiktok live connector server');
});

tiktokSocket.on('disconnect', () => {
  console.log('disconnected from tiktok live connector server');
});

tiktokSocket.on('chat', (message) => {
  console.log('good chat', message);
  // store.dispatch(addMessage(message));
});
