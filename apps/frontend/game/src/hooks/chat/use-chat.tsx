import { useEffect, useRef } from 'react';

import { faker } from '@faker-js/faker';

import { publish } from '@kingo/events';
import {
  ListenToStreamEventKey,
  TikTokChatMessage,
  tiktokSocket,
} from '@kingo/tiktok-client';

import {
  ChatMessage,
  addMessage,
} from '../../lib/features/externalChatSlice';
import { useAppDispatch, useAppSelector } from '../use-redux-typed';

export enum CHAT_ANSWER_EVENTS {
  PROCESSING = 'processing_chat_answer',
  FINISHED_PROCESSING = 'finished_processing_chat_answer',
}
const randomPLayers = mockedTikTokChatMessages(30);

export enum CHAT_EVENTS {
  RECEIVED_MESSAGE = 'chat_receive_message',
}

const tiktokAdapter = (message: TikTokChatMessage): ChatMessage => {
  return {
    user: {
      id: message.userId,
      username: message.nickname,
      avatar_url: message.profilePictureUrl,
    },
    message: {
      id: message.msgId,
      comment: message.comment[0],
      timestamp: new Date().getTime(),
    },
  };
};

export function useChat(
  sources: {
    platform?: 'tiktok' | 'youtube';
    username?: string;
  }[],
) {
  const dispatch = useAppDispatch();
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const didSubscribeToLiveStream = useRef(false);

  useEffect(() => {
    if (!amIHost) return;
    if (didSubscribeToLiveStream.current) return;

    amIHost &&
      sources.forEach(({ platform, username }) => {
        tiktokSocket.emit(ListenToStreamEventKey, username);
      });
    tiktokSocket.on('chat', (message) => {
      dispatch(addMessage(tiktokAdapter(message)));
      publish(CHAT_EVENTS.RECEIVED_MESSAGE, tiktokAdapter(message));
    });
    didSubscribeToLiveStream.current = true;
  }, [amIHost, dispatch, sources, didSubscribeToLiveStream]);

  useEffect(() => {
    return () => {
      tiktokSocket.off('chat');
      tiktokSocket.disconnect();
    };
  }, []);
}

function mockedTikTokChatMessages(count: number) {
  return Array.from({ length: count }, () => ({
    isModerator: false,
    isNewGifter: false,
    comment: faker.lorem.sentence()[0],
    isSubscriber: false,
    createTime: new Date().toISOString(),
    emotes: [],
    followInfo: {
      followStatus: 0,
      followerCount: 0,
      followingCount: 0,
      pushStatus: 0,
    },
    followRole: 0,
    gifterLevel: 0,
    msgId: faker.database.mongodbObjectId(),
    nickname: faker.internet.userName(),
    profilePictureUrl: faker.image.avatar(),
    secUid: faker.database.mongodbObjectId(),
    teamMemberLevel: 0,
    topGifterRank: null,
    uniqueId: faker.database.mongodbObjectId(),
    userId: faker.database.mongodbObjectId(),
    userBadges: [],
    userSceneTypes: [],
    userDetails: {
      bioDescription: faker.lorem.sentence(),
      createTime: new Date().toISOString(),
      profilePictureUrls: [faker.image.avatar()],
    },
  }));
}
