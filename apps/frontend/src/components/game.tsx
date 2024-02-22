'use client';
import React from 'react';
import { myPlayer, useMultiplayerState, usePlayersList } from 'playroomkit';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import questions from '../../mocks/questions.json';
import { AnimatedTooltip } from './ui/animated-tooltip';
import { Answer } from './sections/questions/answer';
import { CountDown } from './sections/questions/count-down';
import { InitRoom } from './init-room';

export default function Game() {
  const [isGameStarted, setIsGameStarted] = useMultiplayerState(
    'isGameStarted',
    false
  );
  const [currentQuestion, setCurrentQuestion] = useMultiplayerState(
    'currentQuestion',
    0
  );
  const [isTimeUp, setIsTimeUp] = useMultiplayerState('isTimeUp', false);
  const currentPlayers = usePlayersList();

  InitRoom();

  const isGameOver = currentQuestion === questions.length - 1 || isTimeUp;
  if (isGameOver) {
    return <div>Game Over</div>;
  }
  if (!isGameStarted) {
    return <div>Loading...</div>;
  }

  return (
    <div>
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
        score: {myPlayer()?.getState('score')}
      </h1>
      <div>
        <h1 className="text-4xl font-bold mb-4">Quiz Game</h1>
        <CountDown />
      </div>

      <Question
        questionData={questions[currentQuestion]}
        onClick={(answer: Answer) => {
          if (answer.isCorrect) {
            setCurrentQuestion(currentQuestion + 1);
            myPlayer().setState('score', myPlayer()?.getState('score') + 1);
          }
        }}
      />
    </div>
  );
}

export interface QuestionData {
  question: string;
  answers: Answer[];
}

interface Props {
  questionData: QuestionData;
  onClick: (answer: Answer) => void;
}

export enum QuestionState {
  UNANSWERED = 'UNANSWERED',
  CORRECT = 'CORRECT',
  INCORRECT = 'INCORRECT',
}
const Question: React.FC<Props> = ({ questionData, onClick }) => {
  const { question, answers } = questionData;

  const [currentQuestionState, setCurrentQuestionState] = useMultiplayerState(
    'currentQuestionState',
    QuestionState.UNANSWERED
  );

  const handleAnswer = (answer: Answer) => {
    onClick(answer);
    if (answer.isCorrect) {
      setCurrentQuestionState(QuestionState.CORRECT);
    } else {
      setCurrentQuestionState(QuestionState.INCORRECT);
    }
  };

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
              onClick={handleAnswer}
              index={index}
              currentQuestionState={currentQuestionState}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
