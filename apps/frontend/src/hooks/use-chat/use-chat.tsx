import { usePubSub } from '../use-pub-sub';
import { useEffect, useRef } from 'react';
import { tiktokSocket } from '@core/tiktok-client';
import { useAppDispatch, useAppSelector } from '../use-redux-typed';
import { faker } from '@faker-js/faker';
import { MatchState } from '../../store/features/matchSlice';
import {
  addMessage,
  ChatAnswerState,
  editMessageMeta,
} from '../../store/features/externalChatSlice';
import { ChatMessageFromExternalPlatform } from './use-chat-players';

export enum CHAT_ANSWER_EVENTS {
  PROCESSING = 'processing_chat_answer',
  FINISHED_PROCESSING = 'finished_processing_chat_answer',
}

export function useChat() {
  const { publish } = usePubSub();
  const messages = useAppSelector((state) => state.externalChat);
  const dispatch = useAppDispatch();

  const isMAtchStarted = useAppSelector(
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

  const randomPlayer =
    randomPLayers[Math.floor(Math.random() * randomPLayers.length)];

  useEffect(() => {
    if (isMAtchStarted) {
      const randomnessMessageInterval = setInterval(() => {
        const message = {
          user: {
            id: randomPlayer.uniqueId,
            username: randomPlayer.nickname,
            avatar_url: randomPlayer.profilePictureUrl,
          },
          message: {
            id: faker.database.mongodbObjectId(),
            comment: ['a', 'b', 'c', 'd'][Math.floor(Math.random() * 4)],
            timestamp: Date.now(),
          },
        };
        dispatch(addMessage(message));
        publish(ChatMessageFromExternalPlatform, message);
      }, 1000);
      return () => clearInterval(randomnessMessageInterval);
    }

    const randomMessageInterval = setInterval(() => {
      const message = {
        user: {
          id: randomPlayer.uniqueId,
          username: randomPlayer.nickname,
          avatar_url: randomPlayer.profilePictureUrl,
        },
        message: {
          id: faker.database.mongodbObjectId(),
          comment: faker.lorem.sentence(),
          timestamp: Date.now(),
        },
      };
      dispatch(addMessage(message));
      publish(ChatMessageFromExternalPlatform, message);
    }, 1000);
    return () => clearInterval(randomMessageInterval);
  }, [
    dispatch,
    isMAtchStarted,
    publish,
    randomPlayer.nickname,
    randomPlayer.profilePictureUrl,
    randomPlayer.uniqueId,
  ]);

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

const randomPLayers = generateRandomPLayers(300);

function generateRandomPLayers(count: number) {
  return Array.from({ length: count }, () => ({
    isModerator: false,
    isNewGifter: false,
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
