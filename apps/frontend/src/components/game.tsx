'use client';
import React, { useEffect, useState } from 'react';
import {
  myPlayer,
  onPlayerJoin,
  PlayerState,
  setState,
  useMultiplayerState,
  usePlayersList,
} from 'playroomkit';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import questions from '../../mocks/questions.json';
import { toast } from 'sonner';
import Countdown from 'react-countdown';

export default function Game() {
  const [isGameStarted, setIsGameStarted] = useState(false);

  useEffect(() => {
    const initializeGame = async () => {
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
        () => setIsGameStarted(true)
      );
    };
    initializeGame();
  }, []);

  const [currentQuestion, setCurrentQuestion] = useMultiplayerState(
    'currentQuestion',
    0
  );

  const [timer, setTimer] = useMultiplayerState('timer', 60);
  const handleAnswer = (answer: Answer) => {
    if (answer.isCorrect) {
      setCurrentQuestion(currentQuestion + 1);
      myPlayer().setState('score', myPlayer().getState('score') + 1);
    } else {
      setState('timer', timer - 4);
    }
  };

  const currentPlayers = usePlayersList();

  useEffect(() => {
    const handlePlayerJoin = (player: PlayerState) => {
      const isOtherPlayer = player.id !== myPlayer().id;
      if (isOtherPlayer) {
        toast(`${player.getProfile().name} joined the game`);
      }

      player.onQuit(() => {
        if (isOtherPlayer) {
          toast(`${player.getProfile().name} left the game`);
        }
      });
    };

    onPlayerJoin(handlePlayerJoin);
  }, []);

  if (currentQuestion === questions.length - 1 || timer === 0) {
    return <div>Game Over</div>;
  }
  if (!isGameStarted) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {currentPlayers.map((player) => (
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
            <Countdown
              renderer={Counter}
              onTick={(time) => {
                console.log(time);
              }}
              date={Date.now() + timer * 1000}
              onComplete={() => {
                setCurrentQuestion(currentQuestion + 1);
              }}
            />
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

function Counter({ seconds = 0 }) {
  return seconds;
}
