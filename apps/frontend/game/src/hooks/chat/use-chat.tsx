import { useEffect } from 'react';
import {
  ListenToStreamEventKey,
  TikTokChatMessage,
  tiktokSocket,
} from '@kingo/tiktok-client';
import { useAppDispatch, useAppSelector } from '../use-redux-typed';
import { faker } from '@faker-js/faker';
import { MatchState } from '../../store/features/matchSlice';
import {
  addMessage,
  ChatAnswerState,
  ChatMessage,
  editMessageMeta,
} from '../../store/features/externalChatSlice';
import { store } from '../../store/store';
import { publish, subscribe } from '@kingo/events';

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
  }[]
) {
  const dispatch = useAppDispatch();
  const amIHost = useAppSelector((state) => state.match.amIHost);

  const isMatchStarted = useAppSelector(
    (state) => state.match.currentMatchState === MatchState.PLAYING
  );

  useEffect(() => {
    console.log('emitting');
    amIHost &&
      sources.forEach(({ platform, username }) => {
        tiktokSocket.emit(ListenToStreamEventKey, username);
      });

    tiktokSocket.on('chat', (message) => {
      console.log('bd chat', message);
      store.dispatch(addMessage(tiktokAdapter(message)));
      publish(CHAT_EVENTS.RECEIVED_MESSAGE, tiktokAdapter(message));
    });
  }, []); // Add isMatchStarted as a dependency

  subscribe(CHAT_ANSWER_EVENTS.PROCESSING, ({ msgId }: { msgId: string }) =>
    dispatch(
      editMessageMeta({
        id: msgId,
        meta: { state: ChatAnswerState.PROCESSING },
      })
    )
  );

  subscribe(
    CHAT_ANSWER_EVENTS.FINISHED_PROCESSING,
    ({ msgId, isCorrect }: { msgId: string; isCorrect: boolean }) => {
      dispatch(
        editMessageMeta({
          id: msgId,
          meta: {
            state: ChatAnswerState.FINISHED_PROCESSING,
            isCorrectAnswer: isCorrect,
          },
        })
      );
    }
  );
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
