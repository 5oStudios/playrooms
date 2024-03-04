'use client';
import { useSearchParams } from 'next/navigation';
import { gameSocket } from '@core/game-client';
import { Match } from '@heroiclabs/nakama-js';
import React, { useEffect, useState } from 'react';
import { MockedMCQQuestions } from '../../../mocks';
import { Question } from '../sections/mcq/questions/question';
import { Leaderboard } from './leaderboard';
import { Answers } from '../sections/mcq/answers/answers';
import { useQuestions } from '../../hooks/use-questions';
import { useLeaderboard } from '../../hooks/use-leaderboard';

export enum MatchOpCodes {
  MATCH_STATE = 100,
  HOST_STATE = 101,
  PLAYER_SCORE = 102,
  QUESTION_INDEX = 103,
  TIME_LEFT = 104,
  LEADERBOARD = 105,
}

export enum LeaderboardState {
  SHOW = 'SHOW',
  HIDE = 'HIDE',
}

export enum MatchState {
  LOADING = 'LOADING',
  READY = 'READY',
  STARTED = 'STARTED',
  ENDED = 'ENDED',
  NOT_FOUND = 'NOT_FOUND',
}

export enum HostState {
  ELECTED = 'ELECTED',
  NOT_ELECTED = 'NOT_ELECTED',
}

export enum PlayerState {
  READY = 'READY',
  NOT_READY = 'NOT_READY',
}

const STARTING_QUESTION_INDEX = 0;
const SHOW_LEADERBOARD_FOR_TIME_IN_MS = 5000;

export default function Match() {
  const searchParams = useSearchParams();
  const ticket = searchParams.get('ticket');
  const token = searchParams.get('token');

  const [currentPlayers, setCurrentPlayers] = useState([]);

  const [match, setMatch] = useState<null | Match>(null);
  const [amIHost, setAmIHost] = useState(false);
  const [myScore, setMyScore] = useState(0);

  const [matchState, setMatchState] = useState(MatchState.READY);
  const [hostState, setHostState] = useState(HostState.NOT_ELECTED);
  const [playerState, setPlayerState] = useState(PlayerState.NOT_READY);

  const {
    currentQuestion,
    nextQuestion,
    isQuestionsFinished,
    handleAnswer,
    questionStateHandler,
  } = useQuestions({
    match,
    questions: MockedMCQQuestions,
    startingQuestionIndex: STARTING_QUESTION_INDEX,
    isHost: amIHost,
  });
  const { isLeaderboardVisible, leaderboardStateHandler, previewLeaderboard } =
    useLeaderboard({
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

  const questions = MockedMCQQuestions;

  useEffect(() => {
    switch (playerState) {
      case PlayerState.NOT_READY:
        gameSocket
          .joinMatch(ticket, token)
          .then((match) => {
            setMatch(match);
            const isFirstPlayer = !match.presences;
            if (isFirstPlayer) {
              setAmIHost(true);
              setHostState(HostState.ELECTED);
              gameSocket.sendMatchState(
                match.match_id,
                MatchOpCodes.HOST_STATE,
                HostState.ELECTED
              );
            }
          })
          .catch((error) => {
            console.error('Error joining match', error);
            setMatchState(MatchState.NOT_FOUND);
          });
        setPlayerState(PlayerState.READY);
        break;
    }
  }, [ticket, token, playerState]);

  gameSocket.onmatchdata = (matchData) => {
    const decodedData = new TextDecoder().decode(matchData.data);
    switch (matchData.op_code) {
      case MatchOpCodes.MATCH_STATE:
        switch (decodedData) {
          case MatchState.READY:
            setMatchState(MatchState.READY);
            break;
          // case MatchState.STARTED:
          //   setMatchState(MatchState.STARTED);
          //   break;
          // case MatchState.ENDED:
          //   setMatchState(MatchState.ENDED);
          //   break;
        }
        break;
      case MatchOpCodes.HOST_STATE:
        switch (decodedData) {
          case HostState.ELECTED:
            setHostState(HostState.ELECTED);
            break;
          case HostState.NOT_ELECTED:
            setHostState(HostState.NOT_ELECTED);
            break;
        }
        break;

      case MatchOpCodes.TIME_LEFT:
        break;

      case MatchOpCodes.QUESTION_INDEX:
        questionStateHandler(matchData);
        break;

      case MatchOpCodes.LEADERBOARD:
        leaderboardStateHandler(matchData);
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
  }, [isQuestionsFinished, questions.length]);

  useEffect(() => {
    if (
      matchState === MatchState.READY &&
      playerState === PlayerState.READY &&
      hostState === HostState.ELECTED
    ) {
      setMatchState(MatchState.STARTED);
    }
  }, [matchState, playerState, hostState, match?.match_id, amIHost]);

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
