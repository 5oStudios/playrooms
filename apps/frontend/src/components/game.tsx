'use client';
import React from 'react';
import { myPlayer, useMultiplayerState, usePlayersList } from 'playroomkit';
import questions from '../../mocks/questions.json';
import { AnimatedTooltip } from './ui/animated-tooltip';
import { Question } from './sections/mcq/questions/question';
import { GiTwoCoins } from 'react-icons/gi';
import { Answers } from './sections/mcq/answers/answers';

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
const TIME = 60;

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

  // InitRoom();

  // GAME STATE SIDE EFFECTS
  // useEffect(() => {
  //   const isQuestionsFinished = currentQuestionIndex === questions.length - 1;
  //   const isPlayerHaveNoScore = myPlayerScore < STARTING_PLAYER_SCORE;
  //
  //   if (isTimeUp || isQuestionsFinished || isPlayerHaveNoScore) {
  //     setCurrentGameState(GAME_STATE.ENDED);
  //   }
  // }, [currentQuestionIndex, isTimeUp, myPlayerScore, setCurrentGameState]);

  if (currentGameState === GAME_STATE.ENDED) return <div>Game Over</div>;
  // if (currentGameState === GAME_STATE.LOADING) return <div>Loading...</div>;

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
      {/*<h1 className="text-4xl font-bold mb-4">score: {myPlayerScore}</h1>*/}
      {/*<div>*/}
      {/*  <h1 className="text-4xl font-bold mb-4">Quiz Game</h1>*/}
      {/*</div>*/}
      {/*<CountDown time={TIME} />*/}
      <GiTwoCoins />
      <div className="flex flex-col gap-2">
        <Question questionText={questions[currentQuestionIndex].question} />
        <Answers
          answers={questions[currentQuestionIndex].answers}
          onClick={(answer) => {
            if (answer.isCorrect) {
              setCurrentQuestionIndex(currentQuestionIndex + 1);
              myPlayer().setState(PLAYER_SCORE_KEY, myPlayerScore + 1);
            }
          }}
        />
      </div>
    </>
  );
}
