'use client';
import { gameSocket } from '@core/game-client';
import React, { useEffect, useState } from 'react';
import { MockedMCQQuestions } from '../../../mocks';
import { Question } from '../sections/mcq/questions/question';
import { Leaderboard } from './leaderboard';
import { Answers } from '../sections/mcq/answers/answers';
import { useQuestions } from '../../hooks/use-questions';
import { useLeaderboard } from '../../hooks/use-leaderboard';
import { HostState, useHost } from '../../hooks/use-host';
import { MatchState, useMatch } from '../../hooks/use-match';
import { PlayerState, usePlayer } from '../../hooks/use-player';

export enum MatchOpCodes {
  MATCH_STATE = 100,
  HOST_STATE = 101,
  PLAYER_STATE = 102,
  QUESTION_INDEX = 103,
  TIME_LEFT = 104,
  LEADERBOARD = 105,
}

const STARTING_QUESTION_INDEX = 0;
const SHOW_LEADERBOARD_FOR_TIME_IN_MS = 5000;

export default function Match() {
  const { match, matchState, matchEventsReceiver, setMatchState } = useMatch();
  const [remainingTime, setRemainingTime] = useState(0);

  const { playerState, playersEventsReceiver } = usePlayer({
    match,
  });

  const { amIHost, hostState, hostEventsReceiver } = useHost({
    match,
  });

  const {
    currentQuestion,
    nextQuestion,
    isQuestionsFinished,
    handleAnswer,
    questionsEventsReceiver,
  } = useQuestions({
    match,
    amIHost,
    questions: MockedMCQQuestions,
    startingQuestionIndex: STARTING_QUESTION_INDEX,
  });

  const {
    isLeaderboardVisible,
    leaderboardEventsReceiver,
    previewLeaderboard,
  } = useLeaderboard({
    match,
    amIHost,
    showLeaderboardForTimeInMs: SHOW_LEADERBOARD_FOR_TIME_IN_MS,
  });

  gameSocket.onmatchdata = (matchData) => {
    switch (matchData.op_code) {
      case MatchOpCodes.MATCH_STATE:
        matchEventsReceiver(matchData);
        break;
      case MatchOpCodes.HOST_STATE:
        hostEventsReceiver(matchData);
        break;
      case MatchOpCodes.QUESTION_INDEX:
        questionsEventsReceiver(matchData);
        break;
      case MatchOpCodes.LEADERBOARD:
        leaderboardEventsReceiver(matchData);
        break;
      case MatchOpCodes.PLAYER_STATE:
        playersEventsReceiver(matchData);
        break;
    }
  };

  useEffect(() => {
    if (isQuestionsFinished) {
      setMatchState(MatchState.ENDED);
    }
  }, [isQuestionsFinished, setMatchState]);

  useEffect(() => {
    if (
      matchState === MatchState.READY &&
      playerState === PlayerState.READY &&
      hostState === HostState.ELECTED
    ) {
      setMatchState(MatchState.STARTED);
    }
  }, [
    matchState,
    playerState,
    hostState,
    match?.match_id,
    amIHost,
    setMatchState,
  ]);

  const onTimeUp = () => {
    previewLeaderboard()
      .then(() => nextQuestion())
      .catch((error) => console.error('Error previewing leaderboard', error));
  };

  switch (matchState) {
    case MatchState.LOADING:
    case MatchState.READY:
      return <>Loading...</>;
    case MatchState.STARTED:
      return (
        <div className="flex justify-center items-center">
          {isLeaderboardVisible ? (
            <Leaderboard />
          ) : (
            <div className="flex flex-col gap-2">
              <Question
                questionText={currentQuestion.question}
                allowedTimeInMS={currentQuestion.allowedTimeInMS}
                onTimeTick={setRemainingTime}
                onTimeUp={onTimeUp}
              />
              <Answers
                answers={currentQuestion.answers}
                onClick={handleAnswer}
              />
            </div>
          )}
        </div>
      );
    case MatchState.ENDED:
      return <>Game Over</>;
    case MatchState.NOT_FOUND:
      return <>Match not found</>;
  }
}
