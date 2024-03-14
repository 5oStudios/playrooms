'use client';
import { useHost } from '../../hooks/use-host';
import {
  JoinMatchProps,
  MatchStateEventsKey,
  useMatch,
} from '../../hooks/use-match';
import { PlayerScoreAction, usePlayer } from '../../hooks/use-player';
import {
  QuestionAnswerEventKey,
  TimeUpEventKey,
  useQuestions,
} from '../../hooks/use-questions';
import { MockedMCQQuestions } from '../../../mocks';
import { useLeaderboard } from '../../hooks/use-leaderboard';
import { Leaderboard } from './leaderboard';
import { Question } from '../sections/mcq/questions/question';
import { Answers } from '../sections/mcq/answers/answers';
import { usePubSub } from '../../hooks/use-pub-sub';
import { MatchState } from '../../store/features/matchSlice';
import { Button } from '@nextui-org/react';
import { useAppSelector } from '../../hooks/use-redux-typed';
import { Answer } from '../sections/mcq/answers/answer';
import { useCallback } from 'react';
import { gameSocket } from '@core/game-client';

export enum SOCKET_OP_CODES {
  MATCH_STATE = 100,
  HOST_STATE = 101,
  PLAYERS_SCORE = 103,
  QUESTION_INDEX = 104,
  TIME_LEFT = 105,
  LEADERBOARD = 106,
}
export enum SOCKET_SYNC {
  MATCH_DATA = 'match_data',
  HOST_STATE = 'host_state',
  PLAYERS_SCORE = 'player_score',
  QUESTION_INDEX = 'question_index',
  TIME_LEFT = 'time_left',
  LEADERBOARD = 'leaderboard',
}

const STARTING_QUESTION_INDEX = 0;
const SHOW_LEADERBOARD_FOR_TIME_IN_MS = 5000;

export default function Match(matchProps: JoinMatchProps) {
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const matchState = useAppSelector((state) => state.match.currentMatchState);
  const { publish } = usePubSub();

  // TODO: refactor this to pub/sub pattern

  useMatch({
    matchId: matchProps.matchId,
  });
  useHost();

  usePlayer();

  const { isLeaderboardVisible } = useLeaderboard({
    showLeaderboardForTimeInMs: SHOW_LEADERBOARD_FOR_TIME_IN_MS,
  });

  const { currentQuestion } = useQuestions({
    questions: MockedMCQQuestions,
    startingQuestionIndex: STARTING_QUESTION_INDEX,
  });

  gameSocket.onmatchdata = (matchData) => {
    const decodedData = new TextDecoder().decode(matchData.data);
    switch (matchData.op_code) {
      case SOCKET_OP_CODES.MATCH_STATE:
        publish(MatchStateEventsKey, decodedData);
        break;
      case SOCKET_OP_CODES.HOST_STATE:
        publish(SOCKET_SYNC.HOST_STATE, decodedData);
        break;
      case SOCKET_OP_CODES.LEADERBOARD:
        publish(SOCKET_SYNC.LEADERBOARD, decodedData);
        break;
      case SOCKET_OP_CODES.PLAYERS_SCORE:
        publish(SOCKET_SYNC.PLAYERS_SCORE, decodedData);
        break;
      case SOCKET_OP_CODES.QUESTION_INDEX:
        publish(SOCKET_SYNC.QUESTION_INDEX, decodedData);
        break;
    }
  };

  const handleAnswer = useCallback(
    (answer: Answer) => {
      console.log('Answered', answer);
      publish(QuestionAnswerEventKey, {
        deservedScore: answer.isCorrect ? 1 : 0,
        scoreAction: answer.isCorrect
          ? PlayerScoreAction.ADD
          : PlayerScoreAction.SUBTRACT,
      });
    },
    [publish]
  );

  switch (matchState) {
    case MatchState.LOADING:
      return <>Loading...</>;
    case MatchState.READY:
      return amIHost ? (
        <>
          <p>Match is ready</p>
          <Button onClick={() => publish('host_requested_start', true)}>
            Start Match
          </Button>
        </>
      ) : (
        <>
          <p>Waiting for host to start the match</p>
        </>
      );

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
                onTimeUp={() => publish(TimeUpEventKey, true)}
              />
              <Answers
                answers={currentQuestion.answers}
                onClick={handleAnswer}
              />
              {/*my score: {myScore}*/}
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
