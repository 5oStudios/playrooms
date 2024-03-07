'use client';
import { useHost } from '../../hooks/use-host';
import { MatchState, useMatch } from '../../hooks/use-match';
import { PlayerScoreAction, usePlayer } from '../../hooks/use-player';
import {
  QuestionAnswerEventKey,
  useQuestions,
} from '../../hooks/use-questions';
import { MockedMCQQuestions } from '../../../mocks';
import { useLeaderboard } from '../../hooks/use-leaderboard';
import { gameSocket } from '@core/game-client';
import { Leaderboard } from './leaderboard';
import { Question } from '../sections/mcq/questions/question';
import { Answers } from '../sections/mcq/answers/answers';
import { usePubSub } from '../../hooks/use-pub-sub';
import { useState } from 'react';

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

export default function Match({
  ticket,
  token,
}: {
  ticket: string;
  token: string;
}) {
  const { publish } = usePubSub();

  // TODO: refactor this to pub/sub pattern
  const [remainingTime, setRemainingTime] = useState<number>(0);

  const { matchState, matchSocketEventsReceiver } = useMatch({
    ticket,
    token,
  });

  const { amIHost, hostSocketEventsReceiver } = useHost();

  const { playerScoreSocketEventsReceiver, playersScore } = usePlayer();

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
                onClick={(answer) =>
                  publish(QuestionAnswerEventKey, {
                    deservedScore: answer.isCorrect ? remainingTime : 0,
                    scoreAction: answer.isCorrect
                      ? PlayerScoreAction.ADD
                      : PlayerScoreAction.SUBTRACT,
                  })
                }
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

export interface AnswerEvent {
  deservedScore: number;
  scoreAction: PlayerScoreAction;
}
