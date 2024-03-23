'use client';
import {
  JoinMatchProps,
  SOCKET_OP_CODES,
  SOCKET_SYNC,
} from '../../hooks/match';
import {
  QUESTION_EVENTS,
  TimeUpEventKey,
  useQuestions,
} from '../../hooks/use-questions';
import { MockedMCQQuestions } from '../../../mocks';
import { Leaderboard } from './leaderboard';
import { Question } from '../sections/mcq/questions/question';
import { Answers } from '../sections/mcq/answers/answers';
import { MatchState } from '../../store/features/matchSlice';
import { Button } from '@nextui-org/react';
import { useAppSelector } from '../../hooks/use-redux-typed';
import { gameSocket } from '@kingo/game-client';
import { PlayerScoreAction } from '../../store/features/playersSlice';
import { publish } from '@kingo/events';

export enum HOST_COMMANDS {
  START_MATCH = 'host_requested_start',
}

export enum PLAYER_COMMANDS {
  SYNC_SCORE = 'sync_score',
}

const STARTING_QUESTION_INDEX = 0;

export default function Match(matchProps: Readonly<JoinMatchProps>) {
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const matchState = useAppSelector((state) => state.match.currentMatchState);
  const myPlayerId = useAppSelector((state) => state.session.user_id);

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
  console.log('Match State:', matchState);

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
    case MatchState.PLAYING:
      return (
        <div className="flex justify-center items-center">
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
                  playerId: myPlayerId,
                  abbreviation: answerAbb,
                });
              }}
            />
          </div>
        </div>
      );
    case MatchState.PAUSED:
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
