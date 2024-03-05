'use client';
import { gameSocket } from '@core/game-client';
import React, { useState } from 'react';
import { MockedMCQQuestions } from '../../../mocks';
import { Question } from '../sections/mcq/questions/question';
import { Leaderboard } from './leaderboard';
import { Answers } from '../sections/mcq/answers/answers';
import { useQuestions } from '../../hooks/use-questions';
import { useLeaderboard } from '../../hooks/use-leaderboard';
import { useHost } from '../../hooks/use-host';
import { MatchState, useMatch } from '../../hooks/use-match';
import { PlayerScoreAction, usePlayer } from '../../hooks/use-player';
import { Answer } from '../sections/mcq/answers/answer';
import { useSearchParams } from 'next/navigation';

export enum MatchOpCodes {
  MATCH_STATE = 100,
  HOST_STATE = 101,
  PLAYER_SCORE = 103,
  QUESTION_INDEX = 104,
  TIME_LEFT = 105,
  LEADERBOARD = 106,
}

const STARTING_QUESTION_INDEX = 0;
const SHOW_LEADERBOARD_FOR_TIME_IN_MS = 5000;

export default function Match() {
  const searchParams = useSearchParams();
  const ticket = searchParams.get('ticket');
  const token = searchParams.get('token');
  const [remainingTime, setRemainingTime] = useState(0);

  const { matchState, matchSocketEventsReceiver } = useMatch({
    ticket,
    token,
  });

  const { amIHost, hostSocketEventsReceiver } = useHost();

  const { playerScoreSocketEventsReceiver, playersScore, changeScore } =
    usePlayer();

  const { currentQuestion, nextQuestion, questionsSocketEventsReceiver } =
    useQuestions({
      amIHost,
      questions: MockedMCQQuestions,
      startingQuestionIndex: STARTING_QUESTION_INDEX,
    });

  const {
    isLeaderboardVisible,
    leaderboardSocketEventsReceiver,
    previewLeaderboard,
  } = useLeaderboard({
    amIHost,
    showLeaderboardForTimeInMs: SHOW_LEADERBOARD_FOR_TIME_IN_MS,
  });

  gameSocket.onmatchdata = (matchData) => {
    switch (matchData.op_code) {
      case MatchOpCodes.MATCH_STATE:
        matchSocketEventsReceiver(matchData);
        break;
      case MatchOpCodes.HOST_STATE:
        hostSocketEventsReceiver(matchData);
        break;
      case MatchOpCodes.QUESTION_INDEX:
        questionsSocketEventsReceiver(matchData);
        break;
      case MatchOpCodes.LEADERBOARD:
        leaderboardSocketEventsReceiver(matchData);
        break;
      case MatchOpCodes.PLAYER_SCORE:
        playerScoreSocketEventsReceiver(matchData);
        break;
    }
  };

  const onTimeUp = () => {
    previewLeaderboard()
      .then(() => nextQuestion())
      .catch((error) => console.error('Error previewing leaderboard', error));
  };

  const handleAnswer = (answer: Answer, remainingTime: number) => {
    const deservedScore = Math.floor(
      currentQuestion.allowedTimeInMS / 1000 - remainingTime
    );
    const score = answer.isCorrect ? deservedScore : 0;
    changeScore({
      score,
      action: answer.isCorrect
        ? PlayerScoreAction.ADD
        : PlayerScoreAction.SUBTRACT,
    });
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
                onClick={(answer) => handleAnswer(answer, remainingTime)}
              />
              {playersScore.map((playerScore) => (
                <div key={playerScore.id}>
                  <p>{playerScore.username}</p>
                  <p>{playerScore.score}</p>
                </div>
              ))}
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
