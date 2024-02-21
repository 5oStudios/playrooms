'use client';
import { myPlayer, onPlayerJoin, useMultiplayerState } from 'playroomkit';
import { toast } from 'sonner';
import React from 'react';
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import Countdown from 'react-countdown';

export default function Game() {
  // (async () => {
  //   const { insertCoin } = await import('playroomkit');
  //   await insertCoin({
  //     matchmaking: true,
  //     turnBased: true,
  //     reconnectGracePeriod: 10000,
  //     defaultPlayerStates: {
  //       score: 0,
  //     },
  //   });
  // })();
  const [timer, setTimer] = useMultiplayerState('timer', 3);

  // Handle players joining the game
  onPlayerJoin((player) => {
    const isOtherPlayer =
      player.getProfile().name !== myPlayer().getProfile().name;
    if (isOtherPlayer) {
      toast(`${player.getProfile().name} joined the game`);
    }

    player.onQuit(() => {
      if (isOtherPlayer) {
        toast(`${player.getProfile().name} left the game`);
      }
    });
  });
  const startTimer = () => {
    const delay = 1000; // Delay in milliseconds

    if (timer > 0) {
      const intervalId = setInterval(() => {
        setTimer(timer - 1);
      }, delay);

      console.log('Timer started');

      // Clear interval when timer reaches 0 to prevent unnecessary execution
      setTimeout(() => {
        clearInterval(intervalId);
        console.log('Timer stopped');
        // Restart the timer
        startTimer();
      }, timer * delay);
    } else {
      console.log('Timer value should be greater than 0 to start.');
    }
  };

  const Counter = ({
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
  }) => {
    return seconds;
  };
  const Completionist = () => <span>You are good to go!</span>;
  return (
    <div>
      <Button onClick={startTimer} className="mb-4">
        Decrease timer
      </Button>
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
        questionData={{
          question: 'What is the capital of France?',
          answers: [
            { option: 'New York', isCorrect: false },
            { option: 'London', isCorrect: false },
            { option: 'Paris', isCorrect: true },
            { option: 'Dublin', isCorrect: false },
          ],
        }}
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
}

const Question: React.FC<Props> = ({ questionData }) => {
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
            <Answer key={index} answer={answer} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

const Answer: React.FC<{ answer: Answer }> = ({ answer }) => {
  const handleClick = async () => {
    myPlayer().setState(
      'score',
      (score: number) => score + (answer.isCorrect ? 1 : 0)
    );
  };

  // const myPhoto = myPlayer().getProfile().photo;
  return (
    <div>
      <button
        className="w-full p-4 rounded-lg bg-background/20 dark:bg-default-100/20 text-lg font-bold"
        style={{ backdropFilter: 'blur(10px)' }}
        onClick={handleClick}
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
