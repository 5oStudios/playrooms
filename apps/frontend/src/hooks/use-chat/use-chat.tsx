import { usePubSub } from '../use-pub-sub';
import { useEffect, useRef } from 'react';
import { TikTokChatMessage, tiktokSocket } from '@core/tiktok-client';
import { useAppDispatch, useAppSelector } from '../use-redux-typed';
import { faker } from '@faker-js/faker';
import { MatchState } from '../../store/features/matchSlice';
import {
  addMessage,
  ChatAnswerState,
  ChatMessage,
  editMessageMeta,
} from '../../store/features/externalChatSlice';
import { ChatMessageFromExternalPlatform } from './use-chat-players';

export enum CHAT_ANSWER_EVENTS {
  PROCESSING = 'processing_chat_answer',
  FINISHED_PROCESSING = 'finished_processing_chat_answer',
}
const randomPLayers = mockedTikTokChatMessages(30);

const tiktokAdapter = (message: TikTokChatMessage): ChatMessage => {
  return {
    user: {
      id: message.userId,
      username: message.nickname,
      avatar_url: message.profilePictureUrl,
    },
    message: {
      id: message.msgId,
      comment: message.comment,
      timestamp: new Date().getTime(),
    },
  };
};

export function useChat() {
  const { publish } = usePubSub();
  const dispatch = useAppDispatch();

  const isMatchStarted = useAppSelector(
    (state) => state.match.currentMatchState === MatchState.STARTED
  );

  const isEmitted = useRef(false);
  useEffect(() => {
    if (isEmitted.current) return;

    console.log('emitting');
    // tiktokSocket.emit(ListenToStreamEventKey, 'dicquewuopamela');
    isEmitted.current = true;
  }, []);

  tiktokSocket.on('chat', (message) => {
    console.log('bd chat', message);
    // store.dispatch(addMessage(message));
  });

  useEffect(() => {
    if (isMatchStarted) {
      const randomnessMessageInterval = setInterval(() => {
        const message = tiktokAdapter(
          randomPLayers[Math.floor(Math.random() * 30)]
        );
        dispatch(addMessage(message));
        publish(ChatMessageFromExternalPlatform, message);
      }, 1000);
      return () => clearInterval(randomnessMessageInterval);
    }

    const randomMessageInterval = setInterval(() => {
      const message = tiktokAdapter(
        randomPLayers[Math.floor(Math.random() * 30)]
      );
      dispatch(addMessage(message));
      publish(ChatMessageFromExternalPlatform, message);
    }, 1000);
    return () => clearInterval(randomMessageInterval);
  }, [dispatch, isMatchStarted, publish]);

  const { subscribe } = usePubSub();

  subscribe({
    event: CHAT_ANSWER_EVENTS.PROCESSING,
    callback: ({ msgId }: { msgId: string }) =>
      dispatch(
        editMessageMeta({
          id: msgId,
          meta: { state: ChatAnswerState.PROCESSING },
        })
      ),
  });

  subscribe({
    event: CHAT_ANSWER_EVENTS.FINISHED_PROCESSING,
    callback: ({ msgId, isCorrect }: { msgId: string; isCorrect: boolean }) => {
      dispatch(
        editMessageMeta({
          id: msgId,
          meta: {
            state: ChatAnswerState.FINISHED_PROCESSING,
            isCorrectAnswer: isCorrect,
          },
        })
      );
    },
  });
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
