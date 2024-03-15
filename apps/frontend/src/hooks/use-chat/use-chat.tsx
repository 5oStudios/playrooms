import { usePubSub } from '../use-pub-sub';
import { useEffect, useRef } from 'react';
import { tiktokSocket } from '@core/tiktok-client';
import { useAppDispatch, useAppSelector } from '../use-redux-typed';
import { faker } from '@faker-js/faker';
import { MatchState } from '../../store/features/matchSlice';
import {
  addMessage,
  editMessageMetadata,
} from '../../store/features/externalChatSlice';
import { ChatMessageFromExternalPlatform } from './use-chat-players';

export enum ChatAnswerState {
  PROCESSING,
  SELECTED,
  CORRECT,
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
    event: 'chat_answer_state',
    callback: ({
      playerId,
      msgId,
      state,
    }: {
      playerId: string;
      msgId: string;
      state: ChatAnswerState;
    }) => {
      console.log('processing_chat_answer', playerId, msgId);

      // TODO: find better way [cleaner code]
      switch (state) {
        case ChatAnswerState.CORRECT:
          dispatch(
            editMessageMetadata({
              id: msgId,
              metadata: {
                isCorrect: true,
                isSelected: false,
                isProcessing: false,
              },
            })
          );
          break;
        case ChatAnswerState.PROCESSING:
          dispatch(
            editMessageMetadata({
              id: msgId,
              metadata: {
                isCorrect: false,
                isSelected: false,
                isProcessing: true,
              },
            })
          );
          break;
        case ChatAnswerState.SELECTED:
          dispatch(
            editMessageMetadata({
              id: msgId,
              metadata: {
                isCorrect: false,
                isSelected: true,
                isProcessing: false,
              },
            })
          );
          break;
      }
    },
  });
}

const randomPLayers = generateRandomPLayers(3);

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
