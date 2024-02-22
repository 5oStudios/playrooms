'use client';
import React, { useEffect } from 'react';
import questions from '../../mocks/questions.json';
import { InitRoom, ROOM_STATE, ROOM_STATE_KEY } from './init-room';
import { MCQQuestions } from './sections/mcq/questions/MCQQuestions';
import CurrentPlayers, {
  STARTING_PLAYER_SCORE,
} from './sections/participants/participants';
import { getState, useMultiplayerState } from 'playroomkit';

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
export const PLAYER_SCORE_KEY = 'playerScore';
export const CURRENT_QUESTION_STATE_KEY = 'currentQuestionState';

export default function Game() {
  const [currentRoomState] = useMultiplayerState(
    ROOM_STATE_KEY,
    ROOM_STATE.LOADING
  );
  const [currentGameState, setCurrentGameState] = useMultiplayerState(
    CURRENT_GAME_STATE_KEY,
    GAME_STATE.LOADING
  );

  InitRoom();

  const myPlayerScore = getState(PLAYER_SCORE_KEY) || STARTING_PLAYER_SCORE;

  // GAME STATE SIDE EFFECTS
  useEffect(() => {
    const isPlayerHaveNoScore = myPlayerScore < STARTING_PLAYER_SCORE;

    if (isPlayerHaveNoScore) {
      setCurrentGameState(GAME_STATE.ENDED);
    }
  }, [myPlayerScore]);

  if (currentRoomState === ROOM_STATE.LOADING) return <div>Loading...</div>;
  if (currentRoomState === ROOM_STATE.READY)
    setCurrentGameState(GAME_STATE.STARTED);
  return (
    <div className={'flex flex-col gap-4 max-w-[610px] w-[100vw] p-4'}>
      {/*<GiTwoCoins />*/}
      <CurrentPlayers />
      <MCQQuestions questions={questions} />
    </div>
  );
}
