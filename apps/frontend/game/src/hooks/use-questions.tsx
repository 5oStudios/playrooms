'use client';

import { useRef } from 'react';

import { publish, useSubscribeIf, useSubscribeOnceIf } from '@kingo/events';

import { PLAYER_COMMANDS } from '../components/match/match';
import { MatchState } from '../lib/features/matchSlice';
import { PlayerScoreAction } from '../lib/features/playersSlice';
import { CHAT_ANSWER_EVENTS } from './chat/use-chat';
import { SOCKET_OP_CODES, SOCKET_SYNC, useMatchSocket } from './match';
import { useAppSelector } from './use-redux-typed';

export enum QUESTION_EVENTS {
  ANSWERED = 'question_answered',
}
export const QuestionsFinishedEventKey = 'questions_finished';
export const TimeUpEventKey = 'time_up';
export const RemainingTimeForQuestionEventKey = (questionIndex: string) =>
  `remaining_time_for_question_${questionIndex}`;
export const QuestionAnswerEventKey = 'question_answer';

export const patterns = {
  A: /^a$/i,
  B: /^b$/i,
  C: /^c$/i,
  D: /^d$/i,
};

export interface IQuestion {
  id: string;
  question: string;
  answers: IAnswer[];
  correctAnswer: string;
  allowedTimeInMS: number;
}

export interface IAnswer {
  label: string;
  isCorrect: boolean;
}

export function useQuestions({
  questions,
  startingQuestionIndex = 0,
}: Readonly<{
  questions: IQuestion[];
  startingQuestionIndex: number;
}>) {
  const memoizedQuestions = useRef(questions);
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const currentQuestionIndex = useRef<number>(startingQuestionIndex);
  const matchState = useAppSelector((state) => state.match.currentMatchState);
  const { sendMatchState } = useMatchSocket();
  const didMyPlayerAnswer = useRef(false);
  const syncQuestionIndex = (newQuestionIndex: number) => {
    currentQuestionIndex.current = newQuestionIndex;

    // amIHost && publish('is_still_playing', newQuestionIndex.toString());
    amIHost &&
      sendMatchState(
        SOCKET_OP_CODES.QUESTION_INDEX,
        newQuestionIndex.toString(),
      );
  };

  console.log({ currentQuestionIndex });

  useSubscribeIf(
    matchState === MatchState.READY && !amIHost,
    SOCKET_SYNC.QUESTION_INDEX,
    (decodedData: string) => {
      const newQuestionIndex = parseInt(decodedData);
      syncQuestionIndex(newQuestionIndex);
    },
  );

  useSubscribeIf(amIHost, TimeUpEventKey, () => {
    if (currentQuestionIndex.current === memoizedQuestions.current.length - 1) {
      publish(QuestionsFinishedEventKey);
    } else {
      syncQuestionIndex(currentQuestionIndex.current + 1);
      publish('next_question');
    }
  });

  useSubscribeOnceIf(amIHost, 'match_started', () => {
    syncQuestionIndex(startingQuestionIndex);
  });

  useSubscribeIf(
    matchState === MatchState.STARTED,
    QUESTION_EVENTS.ANSWERED,
    ({
      playerId,
      abbreviation,
      msgId,
    }: {
      playerId: string;
      abbreviation: string;
      msgId: string;
    }) => {
      didMyPlayerAnswer.current = true;

      const answerIndex = abbreviationToIndex(abbreviation);
      console.log('QUESTION_EVENTS.ANSWERED', playerId, answerIndex);

      const currentQuestion =
        memoizedQuestions.current[currentQuestionIndex.current];
      const answer = currentQuestion.answers[answerIndex];

      if (!answer) {
        console.log('invalid answer index', answerIndex);
        return;
      }

      msgId &&
        publish(CHAT_ANSWER_EVENTS.PROCESSING, {
          msgId,
        });
      console.log('msgId', msgId);

      syncPlayerScore({
        playerId,
        points: answer.isCorrect ? 1 : 0,
        action: answer.isCorrect
          ? PlayerScoreAction.ADD
          : PlayerScoreAction.SUBTRACT,
      });

      msgId &&
        publish(CHAT_ANSWER_EVENTS.FINISHED_PROCESSING, {
          msgId,
          isCorrect: answer.isCorrect,
        });

      didMyPlayerAnswer.current = false;
    },
  );

  const syncPlayerScore = ({
    playerId,
    points,
    action,
  }: {
    playerId: string;
    points: number;
    action: PlayerScoreAction;
  }) => {
    publish(PLAYER_COMMANDS.SYNC_SCORE, {
      user_id: playerId,
      points,
      action,
    });
  };

  return {
    currentQuestion: memoizedQuestions.current[currentQuestionIndex.current],
  };
}
function abbreviationToIndex(abbreviation: string) {
  if (RegExp(patterns.A).exec(abbreviation)) return 0;
  if (RegExp(patterns.B).exec(abbreviation)) return 1;
  if (RegExp(patterns.C).exec(abbreviation)) return 2;
  if (RegExp(patterns.D).exec(abbreviation)) return 3;
}

function indexToAbbreviation(index: number) {
  return ['A', 'B', 'C', 'D'][index];
}
