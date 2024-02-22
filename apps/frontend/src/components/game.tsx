'use client';
import React from 'react';
import { useMultiplayerState } from 'playroomkit';
import questions from '../../mocks/questions.json';
import { InitRoom } from './init-room';
import { MCQQuestions } from './sections/mcq/questions/MCQQuestions';
import CurrentPlayers from './sections/participants/participants';

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
export const PLAYER_SCORE_KEY = 'playerScore';
export const CURRENT_QUESTION_STATE_KEY = 'currentQuestionState';

export default function Game() {
  const [currentGameState, setCurrentGameState] = useMultiplayerState(
    CURRENT_GAME_STATE_KEY,
    GAME_STATE.LOADING
  );
  const [updateUI] = useMultiplayerState('updateUI', 0);

  const [isTimeUp] = useMultiplayerState(IS_TIME_UP_KEY, false);
  InitRoom();

  // GAME STATE SIDE EFFECTS
  // useEffect(() => {
  // const isQuestionsFinished = currentQuestionIndex === questions.length - 1;
  // const isPlayerHaveNoScore = myPlayerScore < STARTING_PLAYER_SCORE;
  //
  // if (isTimeUp || isQuestionsFinished || isPlayerHaveNoScore) {
  //   setCurrentGameState(GAME_STATE.ENDED);
  // }
  // }, [currentQuestionIndex, isTimeUp, myPlayerScore, setCurrentGameState]);

  if (currentGameState === GAME_STATE.ENDED) return <div>Game Over</div>;
  if (currentGameState === GAME_STATE.LOADING) return <div>Loading...</div>;

  return (
    <>
      {/*<GiTwoCoins />*/}
      <CurrentPlayers />
      <MCQQuestions questions={questions} />
    </>
  );
}
