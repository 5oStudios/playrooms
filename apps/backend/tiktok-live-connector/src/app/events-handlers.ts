import { TikTokLiveEvents } from '@kingo/tiktok-client';

import { ChatDto } from './chat/dto/chat.dto';

export const tiktokEvents = [
  // {
  //   key: TikTokLiveEvents.ROOM_USER,
  //   handler: (data) => {
  //     // Handler logic here
  //   },
  // },
  // {
  //   key: TikTokLiveEvents.MEMBER,
  //   handler: (data) => {
  //     // Handler logic here
  //   },
  // },
  {
    key: TikTokLiveEvents.CHAT,
    handler: (data) => new ChatDto(data),
  },
  // {
  //   key: TikTokLiveEvents.GIFT,
  //   handler: (data) => {
  //     // Handler logic here
  //   },
  // },
  // {
  //   key: TikTokLiveEvents.SOCIAL,
  //   handler: (data) => {
  //     // Handler logic here
  //   },
  // },
  // {
  //   key: TikTokLiveEvents.LIKE,
  //   handler: (data) => {
  //     // Handler logic here
  //   },
  // },
  // {
  //   key: TikTokLiveEvents.QUESTION_NEW,
  //   handler: (data) => {
  //     // Handler logic here
  //   },
  // },
  // {
  //   key: TikTokLiveEvents.LINK_MIC_BATTLE,
  //   handler: (data) => {
  //     // Handler logic here
  //   },
  // },
  // {
  //   key: TikTokLiveEvents.LINK_MIC_ARMIES,
  //   handler: (data) => {
  //     // Handler logic here
  //   },
  // },
  // {
  //   key: TikTokLiveEvents.LIVE_INTRO,
  //   handler: (data) => {
  //     // Handler logic here
  //   },
  // },
  // {
  //   key: TikTokLiveEvents.EMOTE,
  //   handler: (data) => {
  //     // Handler logic here
  //   },
  // },
  // {
  //   key: TikTokLiveEvents.ENVELOPE,
  //   handler: (data) => {
  //     // Handler logic here
  //   },
  // },
  // {
  //   key: TikTokLiveEvents.SUBSCRIBE,
  //   handler: (data) => {
  //     // Handler logic here
  //   },
  // },
];
