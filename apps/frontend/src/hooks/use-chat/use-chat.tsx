import { usePubSub } from '../use-pub-sub';
import { useEffect, useState } from 'react';
import { ChatMessage } from '@core/tiktok-client';
import { faker } from '@faker-js/faker';

export function useChat() {
  const { publish } = usePubSub();
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const randomMessageInterval = setInterval(() => {
      const fakeChatMessage = {
        comment: faker.lorem.sentence(),
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
      };
      setMessages((prevMessages) => [...prevMessages, fakeChatMessage]);
    }, 1000);
    return () => clearInterval(randomMessageInterval);
  }, []);

  return {
    messages: messages.map((message) => ({
      id: message.msgId,
      username: message.nickname,
      message: message.comment[0],
      avatar_url: message.profilePictureUrl,
    })),
  };
}
