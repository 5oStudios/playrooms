'use client';
import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { matchIdSearchParamKey } from '../../../../../components/lobby/create/modes/create-tournament';
import Drawer from '../../../../../components/ui/drawer';
import {
  Avatar,
  Button,
  Divider,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  useDisclosure,
} from '@nextui-org/react';
import { IoChatbubbles } from 'react-icons/io5';
import AutoScroll from '@brianmcallister/react-auto-scroll';
import Match from '../../../../../components/match/match';
import { useMatch } from '../../../../../hooks/use-match';
import { useHost } from '../../../../../hooks/use-host';
import { usePlayer } from '../../../../../hooks/use-player';
import { useAppSelector } from '../../../../../hooks/use-redux-typed';
import { useChat } from '../../../../../hooks/use-chat/use-chat';
import { useChatPlayers } from '../../../../../hooks/use-chat/use-chat-players';
import { usePresence } from '../../../../../hooks/use-presence';

export default function Page() {
  const searchParams = useSearchParams();
  const matchId = searchParams.get(matchIdSearchParamKey);
  const socket = useAppSelector((state) => state.socket);

  useMatch({
    matchId,
  });
  useHost();
  usePlayer();
  useChatPlayers();
  usePresence();

  return (
    <>
      <Match matchId={matchId} />
      <Chat />
    </>
  );
}

const SuspendedJoinLobby = () => {};
function ChatMessage({ avatar, username, message }: Record<string, string>) {
  return (
    <div
      className={
        'flex gap-3 items-center p-3 bg-background/40 w-full rounded-md'
      }
    >
      <Avatar
        src={avatar}
        alt={username}
        className={'min-w-8 min-h-8 w-8 h-8'}
      />
      <div className={'flex flex-col gap-1'}>
        <p className={'text-sm font-bold'}>{username}</p>
        <p>{message}</p>
      </div>
    </div>
  );
}

const Chat = () => {
  const { isOpen, onOpenChange } = useDisclosure({
    defaultOpen: true,
  });
  const [height, setHeight] = React.useState(0);

  const autoScrollRef = useRef(null);
  const { messages } = useChat();
  // const messages = [];

  useEffect(() => {
    if (autoScrollRef.current) {
      const parentHeight = autoScrollRef.current.clientHeight;
      setHeight(parentHeight);
    }
  }, [messages]);

  return (
    <>
      <Drawer
        className={'backdrop-blur-xl bg-background/30'}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent className={''}>
          <ModalHeader className={'flex items-center gap-3 text-clip'}>
            <IoChatbubbles className={'w-6 h-6'} />
            <h2 className={'text-2xl font-bold'}>Chat</h2>
          </ModalHeader>
          <Divider />
          <ScrollShadow
            visibility={'both'}
            ref={autoScrollRef}
            className={'h-full'}
          >
            <AutoScroll
              showOption={false}
              height={height}
              scrollBehavior={'smooth'}
              className={'bg-transparent'}
            >
              <div className={'flex flex-col gap-3 p-3'}>
                {messages.map((message) => (
                  <ChatMessage key={message.id} {...message} />
                ))}
              </div>
            </AutoScroll>
          </ScrollShadow>
        </ModalContent>
      </Drawer>
      <Button onClick={onOpenChange} className={'fixed bottom-4 right-4'}>
        Chat
      </Button>
    </>
  );
};
