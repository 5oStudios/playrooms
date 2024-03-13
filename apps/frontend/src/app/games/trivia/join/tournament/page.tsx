'use client';
import React, { Suspense, useEffect, useRef, useState } from 'react';
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
import {
  MatchStateEventsKey,
  useMatch,
  useMatchState,
} from '../../../../../hooks/use-match';
import { HostEventsKey, useHost } from '../../../../../hooks/use-host';
import { useAppSelector } from '../../../../../hooks/use-redux-typed';
import { SocketState } from '../../../../../store/features/socketSlice';
import { MatchState } from '../../../../../store/features/matchSlice';
import { Leaderboard } from '../../../../../components/match/leaderboard';
import { Question } from '../../../../../components/sections/mcq/questions/question';
import { Answers } from '../../../../../components/sections/mcq/answers/answers';
import {
  QuestionAnswerEventKey,
  useQuestions,
} from '../../../../../hooks/use-questions';
import {
  PlayerScoreAction,
  PlayerScoreEventKey,
  usePlayer,
} from '../../../../../hooks/use-player';
import { usePubSub } from '../../../../../hooks/use-pub-sub';
import { MockedMCQQuestions } from '../../../../../../mocks';
import { useLeaderboard } from '../../../../../hooks/use-leaderboard';
import { gameSocket } from '@core/game-client';
import { MatchOpCodes } from '../../../../../components/match/match';

export default function Page() {
  const { isOpen, onOpenChange } = useDisclosure({
    defaultOpen: false,
  });
  const isSocketConnected = useAppSelector(
    (state) => state.socket === SocketState.CONNECTED
  );

  const [height, setHeight] = React.useState(0);

  const autoScrollRef = useRef(null);
  // const { messages } = useChat();
  const messages = [];

  useEffect(() => {
    if (autoScrollRef.current) {
      const parentHeight = autoScrollRef.current.clientHeight;
      setHeight(parentHeight);
    }
  }, [messages]);

  if (!isSocketConnected) return null;

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
  const searchParams = useSearchParams();
  const matchId = searchParams.get(matchIdSearchParamKey);
  useMatch({
    stateHandler: useMatchState,
    matchId: matchId,
  });
  useHost();
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const matchState = useAppSelector((state) => state.match.currentMatchState);
  const { publish } = usePubSub();
  const socket = useAppSelector((state) => state.socket);

  // TODO: refactor this to pub/sub pattern
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const { playersScore } = usePlayer();

  const { currentQuestion, nextQuestion, questionsSocketEventsReceiver } =
    useQuestions({
      amIHost,
      questions: MockedMCQQuestions,
      startingQuestionIndex: 0,
    });

  const {
    isLeaderboardVisible,
    leaderboardSocketEventsReceiver,
    previewLeaderboard,
  } = useLeaderboard({
    amIHost,
    showLeaderboardForTimeInMs: 1000,
  });

  gameSocket.onmatchdata = (matchData) => {
    const decodedData = new TextDecoder().decode(matchData.data);
    switch (matchData.op_code) {
      case MatchOpCodes.MATCH_STATE:
        publish(MatchStateEventsKey, decodedData);
        break;
      case MatchOpCodes.HOST_STATE:
        publish(HostEventsKey, decodedData);
        break;
      case MatchOpCodes.QUESTION_INDEX:
        questionsSocketEventsReceiver(matchData);
        break;
      case MatchOpCodes.LEADERBOARD:
        leaderboardSocketEventsReceiver(matchData);
        break;
      case MatchOpCodes.PLAYER_SCORE:
        publish(PlayerScoreEventKey, decodedData);
        break;
    }
  };

  const onTimeUp = () => {
    previewLeaderboard()
      .then(() => nextQuestion())
      .catch((error) => console.error('Error previewing leaderboard', error));
  };

  switch (matchState) {
    case MatchState.LOADING:
      return <>Loading...</>;
    case MatchState.READY:
      return amIHost ? (
        <>
          <p>Match is ready</p>
          <Button onClick={() => publish('host_requested_start', true)}>
            Start Match
          </Button>
        </>
      ) : (
        <>
          <p>Waiting for host to start the match</p>
        </>
      );

    case MatchState.STARTED:
      return (
        <div className="flex justify-center items-center">
          {isLeaderboardVisible ? (
            <Leaderboard />
          ) : (
            <div className="flex flex-col gap-2">
              <Question
                questionText={currentQuestion.question}
                allowedTimeInMS={currentQuestion.allowedTimeInMS}
                onTimeTick={setRemainingTime}
                onTimeUp={onTimeUp}
              />
              <Answers
                answers={currentQuestion.answers}
                onClick={(answer) =>
                  publish(QuestionAnswerEventKey, {
                    deservedScore: answer.isCorrect ? remainingTime : 0,
                    scoreAction: answer.isCorrect
                      ? PlayerScoreAction.ADD
                      : PlayerScoreAction.SUBTRACT,
                  })
                }
              />
              {playersScore.map((playerScore) => (
                <div key={playerScore.id}>
                  <p>{playerScore.username}</p>
                  <p>{playerScore.score}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    case MatchState.ENDED:
      return <>Game Over</>;
    case MatchState.NOT_FOUND:
      return <>Match not found</>;
  }

  // return <Match matchId={matchId} />;
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
