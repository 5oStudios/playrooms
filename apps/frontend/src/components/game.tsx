'use client';
import { myPlayer, useMultiplayerState, usePlayersList } from 'playroomkit';
import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import Countdown from 'react-countdown';
import questions from '../../mocks/questions.json';

export default function Game() {
  const [isGameStarted, setIsGameStarted] = React.useState(false);
  (async () => {
    const { insertCoin } = await import('playroomkit');
    await insertCoin(
      {
        matchmaking: true,
        turnBased: true,
        reconnectGracePeriod: 10000,
        defaultPlayerStates: {
          score: 0,
        },
      },
      () => {
        setIsGameStarted(true);
      }
    );
  })();

  const [timer, setTimer] = useMultiplayerState('timer', 60);
  const [currentQuestion, setCurrentQuestion] = useMultiplayerState(
    'currentQuestion',
    0
  );

  const handleAnswer = (answer: Answer) => {
    console.log(answer);
    switch (answer.isCorrect) {
      case true:
        setTimer(timer + 10);
        setCurrentQuestion(currentQuestion + 1);
        myPlayer().setState('score', myPlayer().getState('score') + 1);
        break;
      case false:
        setTimer(timer - 10);
        break;
    }
  };

  const activePlayers = usePlayersList();

  // const myScore = usePlayerStore((state) => state.score);
  // Handle players joining the game
  // onPlayerJoin((player) => {
  //   const isOtherPlayer =
  //     player.getProfile().name !== myPlayer().getProfile().name;
  //   if (isOtherPlayer) {
  //     toast(`${player.getProfile().name} joined the game`);
  //   }
  //
  //   player.onQuit(() => {
  //     if (isOtherPlayer) {
  //       toast(`${player.getProfile().name} left the game`);
  //     }
  //   });
  // });
  if (currentQuestion === questions.length - 1) {
    return <div>Game Over</div>;
  }
  if (!isGameStarted) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {activePlayers.map((player) => (
        <div key={player.id}>
          <h1>{player.getProfile().name}</h1>
          <h2>{player.getState('score')}</h2>
        </div>
      ))}
      <h1 className="text-4xl font-bold mb-4">
        score: {myPlayer().getState('score')}
      </h1>
      <div>
        <h1 className="text-4xl font-bold mb-4">Quiz Game</h1>
        <p className="text-lg">
          Welcome to the quiz game! You have 60 seconds to answer as many
          questions as you can.
        </p>
        <p className="text-lg">
          Time remaining:{' '}
          <span className="font-bold" id="score">
            <Countdown renderer={Counter} date={Date.now() + timer * 1000} />
          </span>
        </p>
      </div>

      <Question
        questionData={questions[currentQuestion]}
        onClick={handleAnswer}
      />
    </div>
  );
}
// types.ts
export interface Answer {
  option: string;
  isCorrect: boolean;
}

export interface QuestionData {
  question: string;
  answers: Answer[];
}

interface Props {
  questionData: QuestionData;
  onClick: (answer: Answer) => void;
}

const Question: React.FC<Props> = ({ questionData, onClick }) => {
  const { question, answers } = questionData;

  return (
    <Card
      isBlurred
      className="border-none bg-background/40 dark:bg-default-100/40 max-w-[610px] p-8 rounded-lg backdrop-blur-[2px]"
      shadow="sm"
    >
      <CardHeader className="flex gap-3 mb-3">
        <h2 className="text-2xl font-bold">{question}</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-4">
          {answers.map((answer, index) => (
            <Answer key={index} answer={answer} onClick={onClick} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

const Answer: React.FC<{
  answer: Answer;
  onClick: (answer: Answer) => void;
}> = ({ answer, onClick }) => {
  return (
    <div>
      <button
        className="w-full p-4 rounded-lg bg-background/20 dark:bg-default-100/20 text-lg font-bold"
        style={{ backdropFilter: 'blur(4px)' }}
        onClick={() => onClick(answer)}
      >
        {answer.option}
      </button>

      <div className="flex gap-1">
        {/*<img*/}
        {/*  className="w-8 h-8 rounded-full"*/}
        {/*  src={myPhoto}*/}
        {/*  alt="Your profile"*/}
        {/*/>*/}
        {/*<span className="text-sm">{myPlayer().getProfile().name}</span>*/}
      </div>
    </div>
  );
};
function Counter({
  total = 0,
  days = 0,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0,
  completed = false,
}: {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
  completed: boolean;
}) {
  return seconds;
}

// const usePlayerStore = create<{
//   score: number;
//   setScore: (score: number) => void;
//   increaseScore: () => void;
// }>((set) => {
//   return {
//     score: 0,
//     setScore: (score: number) => set({ score }),
//     increaseScore: () => set((state) => ({ score: state.score + 1 })),
//   };
// });
//
// const useQuestionStore = create<{
//   currentQuestion: number;
//   nextQuestion: () => void;
// }>((set) => {
//   return {
//     currentQuestion: 0,
//     nextQuestion: () =>
//       set((state) => ({ currentQuestion: state.currentQuestion + 1 })),
//   };
// });
