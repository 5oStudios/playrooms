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
  useDisclosure,
} from '@nextui-org/react';
import { IoChatbubbles } from 'react-icons/io5';
import { useChat } from '../../../../../hooks/use-chat';
import AutoScroll from '@brianmcallister/react-auto-scroll';

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
      console.log('parentHeight', parentHeight);
      console.log('parentHeight', parentHeight);
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
          <div ref={autoScrollRef} className={'h-full'}>
            <AutoScroll
              showOption={false}
              height={height}
              scrollBehavior={'smooth'}
            >
              <div className={'flex flex-col gap-3 p-3'}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={
                      'flex gap-3 items-center p-3 bg-background/40 w-full rounded-md'
                    }
                  >
                    <Avatar
                      src={message.avatar}
                      alt={message.username}
                      className={'min-w-8 min-h-8 w-8 h-8'}
                    />
                    <div className={'flex flex-col gap-1'}>
                      <p className={'text-sm font-bold'}>{message.username}</p>
                      <p>{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AutoScroll>
          </div>
        </ModalContent>
      </Drawer>
      <Suspense fallback={<div>Loading...</div>}>
        <SuspendedJoinLobby />
      </Suspense>
    </>
  );
}

const SuspendedJoinLobby = () => {
  const searchParams = useSearchParams();
  const lobbyMode =
    searchParams.get(lobbyModeSearchParamKey) || LobbyMode.TOURNAMENT;
  const tournamentId = searchParams.get(tournamentIdSearchParamKey);

  return tournamentId;

  // return <JoinLobby partyId={partyId} mode={+lobbyMode} />;
};
