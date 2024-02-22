'use client';
import React, { useEffect } from 'react';
import {
  myPlayer,
  setState,
  useMultiplayerState,
  usePlayersList,
} from 'playroomkit';
import questions from '../../mocks/questions.json';
import { AnimatedTooltip } from './ui/animated-tooltip';
import { Question } from './sections/mcq/questions/question';
import { Answers } from './sections/mcq/answers/answers';
import { InitRoom } from './init-room';

export enum GAME_STATE {
  LOADING = 'LOADING',
  STARTED = 'STARTED',
  ENDED = 'ENDED',
}

export enum QuestionState {
  UNANSWERED = 'UNANSWERED',
  CORRECT = 'CORRECT',
  INCORRECT = 'INCORRECT',
  MISSED = 'MISSED',
}

export const CURRENT_GAME_STATE_KEY = 'gameState';
export const ALLOWED_TIME_IN_MS_KEY = 'allowedTimeInMS';
export const IS_TIME_UP_KEY = 'isTimeUp';
const CURRENT_QUESTION_INDEX_KEY = 'currentQuestionIndex';
export const PLAYER_SCORE_KEY = 'playerScore';
export const CURRENT_QUESTION_STATE_KEY = 'currentQuestionState';

const STARTING_PLAYER_SCORE = 0;
const STARTING_QUESTION_INDEX = 0;
const ALLOWED_TIME_IN_MS = 5000;

export default function Game() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useMultiplayerState(
    CURRENT_QUESTION_INDEX_KEY,
    STARTING_QUESTION_INDEX
  );
  const [currentGameState, setCurrentGameState] = useMultiplayerState(
    CURRENT_GAME_STATE_KEY,
    GAME_STATE.LOADING
  );
  const [allowedTimeInMS] = useMultiplayerState(
    ALLOWED_TIME_IN_MS_KEY,
    ALLOWED_TIME_IN_MS
  );
  const [currentQuestionState] = useMultiplayerState(
    CURRENT_QUESTION_STATE_KEY,
    QuestionState.UNANSWERED
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

  // QUESTION SIDE EFFECTS
  useEffect(() => {
    console.log('currentQuestionState', currentQuestionState);
    console.log('currentQuestionIndex', currentQuestionIndex);
    const nextQuestion = () => {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setState(CURRENT_QUESTION_STATE_KEY, QuestionState.UNANSWERED);
    };
    switch (currentQuestionState) {
      case QuestionState.MISSED:
        nextQuestion();
        break;
      case QuestionState.CORRECT:
        myPlayer().setState(PLAYER_SCORE_KEY, myPlayerScore + 1);
        nextQuestion();
        break;
    }
  }, [currentQuestionState]);

  if (currentGameState === GAME_STATE.ENDED) return <div>Game Over</div>;
  if (currentGameState === GAME_STATE.LOADING) return <div>Loading...</div>;

  return (
    <>
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
      {/*<GiTwoCoins />*/}
      <div className="flex flex-col gap-2">
        <Question
          questionText={questions[currentQuestionIndex].question}
          allowedTimeInMS={allowedTimeInMS}
        />
        <Answers
          answers={questions[currentQuestionIndex].answers}
          onClick={(answer) => {
            switch (answer.isCorrect) {
              case true:
                setState(CURRENT_QUESTION_STATE_KEY, QuestionState.CORRECT);
                break;
              case false:
                setState(CURRENT_QUESTION_STATE_KEY, QuestionState.INCORRECT);
                break;
            }
          }}
        />
      </div>
    </>
  );
}
