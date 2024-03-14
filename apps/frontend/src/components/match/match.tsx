'use client';
import { HostEventsKey, useHost } from '../../hooks/use-host';
import {
  JoinMatchProps,
  MatchStateEventsKey,
  useMatch,
  useMatchState,
} from '../../hooks/use-match';
import {
  OtherPlayersScoreEventKey,
  PlayerScoreAction,
  usePlayer,
} from '../../hooks/use-player';
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
import { MatchState } from '../../store/features/matchSlice';
import { Button } from '@nextui-org/react';
import { useAppSelector } from '../../hooks/use-redux-typed';
import { Answer } from '../sections/mcq/answers/answer';
import { useCallback } from 'react';

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

export default function Match(matchProps: JoinMatchProps) {
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const matchState = useAppSelector((state) => state.match.currentMatchState);
  // const myScore = useAppSelector((state) => state.players.myPlayer.score);
  const { publish } = usePubSub();
  const socket = useAppSelector((state) => state.socket);

  // TODO: refactor this to pub/sub pattern

  useMatch({
    stateHandler: useMatchState,
    matchId: matchProps.matchId,
  });
  useHost();

  usePlayer();

  const { currentQuestion, nextQuestion, questionsSocketEventsReceiver } =
    useQuestions({
      questions: MockedMCQQuestions,
      startingQuestionIndex: STARTING_QUESTION_INDEX,
    });

  const {
    isLeaderboardVisible,
    leaderboardSocketEventsReceiver,
    previewLeaderboard,
  } = useLeaderboard({
    showLeaderboardForTimeInMs: SHOW_LEADERBOARD_FOR_TIME_IN_MS,
  });

  gameSocket.onmatchdata = (matchData) => {
    const decodedData = new TextDecoder().decode(matchData.data);
    switch (matchData.op_code) {
      case MatchOpCodes.MATCH_STATE:
        publish(MatchStateEventsKey, decodedData);
        break;
      case MatchOpCodes.HOST_STATE:
        publish(HostEventsKey, decodedData);
        break;
      case MatchOpCodes.QUESTION_INDEX:
        questionsSocketEventsReceiver(matchData);
        break;
      case MatchOpCodes.LEADERBOARD:
        leaderboardSocketEventsReceiver(matchData);
        break;
      case MatchOpCodes.PLAYER_SCORE:
        publish(OtherPlayersScoreEventKey, decodedData);
        break;
    }
  };

  const onTimeUp = useCallback(() => {
    previewLeaderboard()
      .then(() => nextQuestion())
      .catch((error) => console.error('Error previewing leaderboard', error));
  }, [nextQuestion, previewLeaderboard]);

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
                onTimeUp={onTimeUp}
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
