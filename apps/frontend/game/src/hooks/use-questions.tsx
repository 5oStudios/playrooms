'use client';
import { useCallback, useEffect, useState } from 'react';
import { gameSocket } from '@kingo/game-client';
import {
  PLAYER_COMMANDS,
  SOCKET_OP_CODES,
  SOCKET_SYNC,
} from '../components/match/match';
import { useAppSelector } from './use-redux-typed';
import { PlayerScoreAction } from '../store/features/playersSlice';
import { MatchState } from '../store/features/matchSlice';
import { CHAT_ANSWER_EVENTS } from './chat/use-chat';
import { publish, subscribe } from '@kingo/events';

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
  const amIHost = useAppSelector((state) => state.match.amIHost);
  const match = useAppSelector((state) => state.match.currentMatch);
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    startingQuestionIndex
  );
  const matchState = useAppSelector((state) => state.match.currentMatchState);
  const [playersAnswered, setPlayersAnswered] = useState<string[]>([]);

  const nextQuestion = useCallback(() => {
    if (!amIHost) return;
    setCurrentQuestion(questions[currentQuestionIndex + 1]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setPlayersAnswered([]);

    gameSocket.sendMatchState(
      match?.match_id,
      SOCKET_OP_CODES.QUESTION_INDEX,
      (currentQuestionIndex + 1).toString()
    );
  }, [amIHost, currentQuestionIndex, match?.match_id, questions]);

  useEffect(() => {
    if (currentQuestionIndex === questions.length - 1) {
      publish(QuestionsFinishedEventKey, true);
    }
  }, [currentQuestionIndex, questions, questions.length]);

  subscribe(SOCKET_SYNC.QUESTION_INDEX, (decodedData: string) => {
    const questionIndex = parseInt(decodedData);
    setCurrentQuestion(questions[questionIndex]);
    setCurrentQuestionIndex(questionIndex);
    setPlayersAnswered([]);
  });

  subscribe(TimeUpEventKey, nextQuestion);

  subscribe(
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
      if (matchState !== MatchState.STARTED) return;
      if (playersAnswered.includes(playerId)) return;
      setPlayersAnswered([...playersAnswered, playerId]);

      const answerIndex = abbreviationToIndex(abbreviation);
      console.log('QUESTION_EVENTS.ANSWERED', playerId, answerIndex);

      if (playersAnswered.includes(playerId)) {
        console.log('player already answered', playersAnswered);
        return;
      }
      const answer = currentQuestion.answers[answerIndex];

      if (!answer) {
        console.log('invalid answer index', answerIndex);
        return;
      }

      msgId &&
        publish(CHAT_ANSWER_EVENTS.PROCESSING, {
          msgId,
        });

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
    }
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
    currentQuestion,
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
