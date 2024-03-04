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

export enum MatchOpCodes {
  MATCH_STATE = 100,
  HOST_STATE = 101,
  PLAYER_SCORE = 102,
  QUESTION_INDEX = 103,
  TIME_LEFT = 104,
  LEADERBOARD = 105,
}

export enum PlayerState {
  READY = 'READY',
  NOT_READY = 'NOT_READY',
}

const STARTING_QUESTION_INDEX = 0;
const SHOW_LEADERBOARD_FOR_TIME_IN_MS = 5000;

export default function Match() {
  const questions = MockedMCQQuestions;
  const [currentPlayers, setCurrentPlayers] = useState([]);
  const [myScore, setMyScore] = useState(0);
  const [playerState, setPlayerState] = useState(PlayerState.NOT_READY);

  const { match, matchState, matchEventsReceiver, setMatchState } = useMatch();

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
    questions: MockedMCQQuestions,
    startingQuestionIndex: STARTING_QUESTION_INDEX,
    isHost: amIHost,
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

  const onTimeTick = (remainingTime: number) => {
    if (remainingTime === 0) {
      previewLeaderboard()
        .then(() => nextQuestion())
        .catch((error) => console.error('Error previewing leaderboard', error));
    }
  };

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
      case MatchOpCodes.PLAYER_SCORE:
        // const deservedPoints = uint8ArrayToNum(matchData.data);
        break;
    }
  };

  gameSocket.onmatchpresence = (matchPresence) => {
    matchPresence.joins &&
      setCurrentPlayers((prevPlayers) => [
        ...prevPlayers,
        ...matchPresence.joins,
      ]);
    matchPresence.leaves &&
      setCurrentPlayers((prevPlayers) =>
        prevPlayers.filter((player) => !matchPresence.leaves.includes(player))
      );
  };

  useEffect(() => {
    if (isQuestionsFinished) {
      setMatchState(MatchState.ENDED);
    }
  }, [isQuestionsFinished, questions.length, setMatchState]);

  useEffect(() => {
    console.log('matchState', matchState);
    console.log('playerState', playerState);
    console.log('hostState', hostState);
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

  switch (matchState) {
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
                handleQuestionRemainingTime={onTimeTick}
                isMatchStarted={true}
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
      console.log('amIHost', amIHost);
      return (
        <>
          <div>Game Over</div>
        </>
      );
    case MatchState.NOT_FOUND:
      return <>Match not found</>;
  }
  // if (hostState === HostState.NOT_ELECTED) return <>Looking for host...</>;
}
