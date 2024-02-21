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
import { Button, Card, CardBody, CardHeader } from '@nextui-org/react';
import questions from '../../mocks/questions.json';
import { toast } from 'sonner';
import Countdown from 'react-countdown';
import { AnimatedTooltip } from './ui/animated-tooltip';
import * as process from 'process';
import { cn } from '../utils/cn';

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

  const [timer, setTimer] = useMultiplayerState('timer', 30);
  const [isGameEnded, setIsGameEnded] = useState(false);
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

  if (
    currentQuestion === questions.length - 1 ||
    timer === 0 ||
    (isGameEnded && process.env.NODE_ENV !== 'development')
  ) {
    return <div>Game Over</div>;
  }
  if (!isGameStarted) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/*<h1>{player.getProfile().name}</h1>*/}
      {/*<h2>{player.getState('score')}</h2>*/}
      <div className="flex gap-8">
        <AnimatedTooltip
          items={currentPlayers.map((player) => ({
            id: player.id,
            name: player.getProfile().name,
            designation: `Score: ${player.getState('score')}`,
            image: player.getProfile().photo,
          }))}
        />
      </div>
      <h1 className="text-4xl font-bold mb-4">
        score: {myPlayer().getState('score')}
      </h1>
      <div>
        <h1 className="text-4xl font-bold mb-4">Quiz Game</h1>
        <p className="text-lg">
          Time remaining:{' '}
          <span className="font-bold" id="score">
            <Countdown
              renderer={Counter}
              onTick={(time) => {
                setTimer(time.seconds);
              }}
              date={Date.now() + timer * 1000}
              onComplete={() => {
                setIsGameEnded(true);
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
      className="border-none bg-neutral-950/60 dark:bg-default-100/45 max-w-[610px] p-8 rounded-lg backdrop-blur-[2px]"
      shadow="sm"
    >
      <CardHeader className="flex gap-3 mb-6">
        <h2 className="text-2xl font-bold">{question}</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-4">
          {answers.map((answer, index) => (
            <Answer
              key={index}
              answer={answer}
              onClick={onClick}
              index={index}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

const Answer: React.FC<{
  index: number;
  answer: Answer;
  onClick: (answer: Answer) => void;
}> = ({ answer, onClick, index }) => {
  const [playersChooseThis, setPlayersChooseThis] = useMultiplayerState(
    `playersChooseThis${index}`,
    []
  );
  const myPhoto = myPlayer().getProfile().photo;

  let abbreviation = '';
  switch (index) {
    case 0:
      abbreviation = 'A';
      break;
    case 1:
      abbreviation = 'B';
      break;
    case 2:
      abbreviation = 'C';
      break;
    case 3:
      abbreviation = 'D';
      break;
  }
  return (
    <div>
      <Button
        size="lg"
        disableRipple={true}
        className={cn(
          'w-full rounded-lg bg-neutral-950/90 dark:bg-default-100/20 text-lg font-bold flex text-center items-center justify-center overflow-hidden relative shadow-md transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-neutral-950/90 dark:focus:ring-offset-default-100/20',
          {}
        )}
        style={{ backdropFilter: 'blur(4px)' }}
        onClick={() => onClick(answer)}
      >
        <span className="text-2xl font-bold left-0 px-4 py-2 top-0 text-center bg-gradient-to-r from-emerald-500 to-sky-500 text-transparent bg-clip-text">
          {abbreviation}
        </span>
        <span className="flex-1">{answer.option}</span>

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent w-px" />
      </Button>
      <div className={cn('flex gap-2 mt-2')}>
        {playersChooseThis.map((playerId) => (
          <img
            key={playerId}
            src={myPhoto}
            alt="player"
            className="h-8 w-8 rounded-full"
          />
        ))}
      </div>
    </div>
  );
};

function Counter({ seconds = 0 }) {
  return seconds;
}
