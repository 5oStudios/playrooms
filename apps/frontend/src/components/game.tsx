'use client';
import { me, onPlayerJoin, RPC, setState } from 'playroomkit';
import { toast } from 'sonner';
import React from 'react';
import { Card, CardBody, CardHeader } from '@nextui-org/react';

export default function Game() {
  (async () => {
    const { insertCoin } = await import('playroomkit');
    await insertCoin({
      matchmaking: true,
      turnBased: true,
      reconnectGracePeriod: 10000,
      defaultPlayerStates: {
        score: 0,
      },
    });
  })();

  // Handle players joining the game
  onPlayerJoin((player) => {
    const isOtherPlayer = player.getProfile().name !== me().getProfile().name;
    if (isOtherPlayer) {
      toast(`${player.getProfile().name} joined the game`);
    }
    setState('timeLeft', 60);

    player.onQuit(() => {
      if (isOtherPlayer) {
        toast(`${player.getProfile().name} left the game`);
      }
    });
  });

  return (
    <div>
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
  const handleClick = () => {
    RPC.call('chooseAnswer', { answer });
  };

  return (
    <button
      className="w-full p-4 rounded-lg bg-background/20 dark:bg-default-100/20 text-lg font-bold"
      style={{ backdropFilter: 'blur(10px)' }}
      onClick={handleClick}
    >
      {answer.option}
    </button>
  );
};

RPC.register('chooseAnswer', (data, caller) => {
  console.log(data);
  console.log(caller);
  return Promise.resolve("You've chosen an answer");
});
