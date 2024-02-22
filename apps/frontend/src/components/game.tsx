'use client';
import React, { useEffect } from 'react';
import { myPlayer, useMultiplayerState, usePlayersList } from 'playroomkit';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import questions from '../../mocks/questions.json';
import { AnimatedTooltip } from './ui/animated-tooltip';
import { Answer } from './sections/questions/answer';
import { CountDown } from './sections/questions/count-down';
import { InitRoom } from './init-room';

export enum GAME_STATE {
  LOADING = 'LOADING',
  STARTED = 'STARTED',
  ENDED = 'ENDED',
}

export const CURRENT_GAME_STATE_KEY = 'gameState';
const IS_TIME_UP_KEY = 'isTimeUp';
const CURRENT_QUESTION_INDEX_KEY = 'currentQuestionIndex';
const PLAYER_SCORE_KEY = 'playerScore';
const STARTING_PLAYER_SCORE = 0;
const STARTING_QUESTION_INDEX = 0;

export default function Game() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useMultiplayerState(
    CURRENT_QUESTION_INDEX_KEY,
    STARTING_QUESTION_INDEX
  );
  const [currentGameState, setCurrentGameState] = useMultiplayerState(
    CURRENT_GAME_STATE_KEY,
    GAME_STATE.LOADING
  );
  const [isTimeUp] = useMultiplayerState(IS_TIME_UP_KEY, false);
  const currentPlayers = usePlayersList();
  const myPlayerScore =
    myPlayer()?.getState(PLAYER_SCORE_KEY) || STARTING_PLAYER_SCORE;

  InitRoom();

  // GAME STATE SIDE EFFECTS
  useEffect(() => {
    const isQuestionsFinished = currentQuestionIndex === questions.length - 1;
    const isPlayerHaveNoScore = myPlayerScore < STARTING_PLAYER_SCORE;

    if (isTimeUp || isQuestionsFinished || isPlayerHaveNoScore) {
      setCurrentGameState(GAME_STATE.ENDED);
    }
  }, [currentQuestionIndex, isTimeUp, myPlayerScore, setCurrentGameState]);

  if (currentGameState === GAME_STATE.ENDED) return <div>Game Over</div>;
  if (currentGameState === GAME_STATE.LOADING) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex gap-8">
        <AnimatedTooltip
          items={currentPlayers.map((player) => ({
            id: player.id,
            name: player.getProfile().name,
            designation: `Score: ${player.getState(PLAYER_SCORE_KEY)}`,
            image: player.getProfile().photo,
          }))}
        />
      </div>
      <h1 className="text-4xl font-bold mb-4">score: {myPlayerScore}</h1>
      <div>
        <h1 className="text-4xl font-bold mb-4">Quiz Game</h1>
        <CountDown />
      </div>

      <Question
        questionData={questions[currentQuestionIndex]}
        onClick={(answer: Answer) => {
          if (answer.isCorrect) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            myPlayer().setState(PLAYER_SCORE_KEY, myPlayerScore + 1);
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
