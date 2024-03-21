'use client';
import { JoinMatchProps } from '../../hooks/match/use-match';
import {
  QUESTION_EVENTS,
  TimeUpEventKey,
  useQuestions,
} from '../../hooks/use-questions';
import { MockedMCQQuestions } from '../../../mocks';
import { useLeaderboard } from '../../hooks/use-leaderboard';
import { Leaderboard } from './leaderboard';
import { Question } from '../sections/mcq/questions/question';
import { Answers } from '../sections/mcq/answers/answers';
import { MatchState } from '../../store/features/matchSlice';
import { Button } from '@nextui-org/react';
import { useAppSelector } from '../../hooks/use-redux-typed';
import { gameSocket } from '@kingo/game-client';
import { PlayerScoreAction } from '../../store/features/playersSlice';
import { publish } from '@kingo/events';

export enum SOCKET_OP_CODES {
  MATCH_STATE = 100,
  HOST_STATE = 101,
  PLAYERS_SCORE = 103,
  QUESTION_INDEX = 104,
  LEADERBOARD = 106,
}
export enum SOCKET_SYNC {
  MATCH_STATE = 'match_state',
  HOST_STATE = 'host_state',
  PLAYER_SCORE = 'player_score',
  QUESTION_INDEX = 'question_index',
  LEADERBOARD = 'leaderboard',
}

export enum HOST_COMMANDS {
  START_MATCH = 'host_requested_start',
}

export enum PLAYER_COMMANDS {
  SYNC_SCORE = 'sync_score',
}

const STARTING_QUESTION_INDEX = 0;
const SHOW_LEADERBOARD_FOR_TIME_IN_MS = 5000;

export default function Match(matchProps: Readonly<JoinMatchProps>) {
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const matchState = useAppSelector((state) => state.match.currentMatchState);
  const session = useAppSelector((state) => state.session);
  const myPlayer = useAppSelector((state) =>
    state.players.find((player) => player.user_id === session?.user_id)
  );
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
        publish(SOCKET_SYNC.MATCH_STATE, decodedData);
        break;
      case SOCKET_OP_CODES.HOST_STATE:
        publish(SOCKET_SYNC.HOST_STATE, decodedData);
        break;
      case SOCKET_OP_CODES.LEADERBOARD:
        publish(SOCKET_SYNC.LEADERBOARD, decodedData);
        break;
      case SOCKET_OP_CODES.PLAYERS_SCORE:
        publish(SOCKET_SYNC.PLAYER_SCORE, decodedData);
        break;
      case SOCKET_OP_CODES.QUESTION_INDEX:
        publish(SOCKET_SYNC.QUESTION_INDEX, decodedData);
        break;
    }
  };

  switch (matchState) {
    case MatchState.LOADING:
      return <>Loading...</>;
    case MatchState.READY:
      return amIHost ? (
        <div className="flex flex-col gap-2">
          <p>Match is ready</p>
          <Button onClick={() => publish(HOST_COMMANDS.START_MATCH, true)}>
            Start Match
          </Button>

          <CurrentPlayers />
        </div>
      ) : (
        <p>Waiting for host to start the match</p>
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
                onClick={(answerAbb) => {
                  publish(QUESTION_EVENTS.ANSWERED, {
                    playerId: myPlayer.user_id,
                    abbreviation: answerAbb,
                  });
                }}
              />
            </div>
          )}
        </div>
      );
    case MatchState.ENDED:
      return <Leaderboard />;
    case MatchState.NOT_FOUND:
      return <>Match not found</>;

    default:
      return <>finding match...</>;
  }
}

export interface AnswerEvent {
  deservedScore: number;
  scoreAction: PlayerScoreAction;
}

export function CurrentPlayers() {
  const players = useAppSelector((state) => state.players);

  return (
    <div>
      {players.map((player) => (
        <div key={player.user_id}>
          {player.username} : {'👍'}
        </div>
      ))}
    </div>
  );
}
