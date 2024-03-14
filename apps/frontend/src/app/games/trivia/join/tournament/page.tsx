'use client';
import React, { Suspense, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  LobbyMode,
  lobbyModeSearchParamKey,
} from '../../../../../components/lobby/lobby-actions/joinLobby';
import { tournamentIdSearchParamKey } from '../../../../../components/lobby/create/modes/create-tournament';
import Drawer from '../../../../../components/ui/drawer';
import {
  Avatar,
  Divider,
  ModalContent,
  ModalHeader,
  ScrollShadow,
  useDisclosure,
} from '@nextui-org/react';
import { IoChatbubbles } from 'react-icons/io5';
import { useChat } from '../../../../../hooks/use-chat';
import AutoScroll from '@brianmcallister/react-auto-scroll';
import { useAppSelector } from '../../../../../hooks/use-redux-typed';
import { useMatch } from '../../../../../hooks/use-match';

export default function Page() {
  const { isOpen, onOpenChange } = useDisclosure({
    defaultOpen: true,
  });
  const [height, setHeight] = React.useState(0);

  const autoScrollRef = useRef(null);
  const { messages } = useChat();

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
      <Suspense fallback={<div>Loading...</div>}>
        <SuspendedJoinLobby />
      </Suspense>
    </>
  );
}

const SuspendedJoinLobby = () => {
  const socket = useAppSelector((state) => state.socket);
  const searchParams = useSearchParams();
  const lobbyMode =
    searchParams.get(lobbyModeSearchParamKey) || LobbyMode.TOURNAMENT;
  const tournamentId = searchParams.get(tournamentIdSearchParamKey);
  const session = useAppSelector((state) => state.session);
  const { matchState } = useMatch({ matchId: tournamentId });
  console.log('matchState', matchState);

  return 'test';
  // return <JoinLobby partyId={partyId} mode={+lobbyMode} />;
};
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