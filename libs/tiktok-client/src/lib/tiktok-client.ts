import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';
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

export const tiktokSocket: Socket = io('kingo-staging-tiktok.onrender.com', {
  transports: ['websocket'],
});
tiktokSocket.connect();
tiktokSocket.on('connect', () => {
  console.log('connected to tiktok live connector server');
});

tiktokSocket.on('disconnect', () => {
  console.log('disconnected from tiktok live connector server');
});

tiktokSocket.on('error', (error) => {
  console.log('tiktok error', error);
  toast.error('TikTok live connector error', error);
});
