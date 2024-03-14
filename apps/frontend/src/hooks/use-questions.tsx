'use client';
import { useCallback, useEffect, useState } from 'react';
import { IQuestion } from '../components/sections/mcq/questions/MCQQuestions';
import { gameSocket } from '@core/game-client';
import { SOCKET_OP_CODES, SOCKET_SYNC } from '../components/match/match';
import { usePubSub } from './use-pub-sub';
import { useAppSelector } from './use-redux-typed';

export const QuestionsFinishedEventKey = 'questions_finished';
export const TimeUpEventKey = 'time_up';
export const RemainingTimeForQuestionEventKey = (questionIndex: string) =>
  `remaining_time_for_question_${questionIndex}`;
export const QuestionAnswerEventKey = 'question_answer';

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
  const { publish, subscribe } = usePubSub();

  const nextQuestion = useCallback(() => {
    if (!amIHost) return;
    setCurrentQuestion(questions[currentQuestionIndex + 1]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
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
  }, [currentQuestionIndex, publish, questions, questions.length]);

  subscribe({
    event: SOCKET_SYNC.QUESTION_INDEX,
    callback: (decodedData: string) => {
      const questionIndex = parseInt(decodedData);
      setCurrentQuestion(questions[questionIndex]);
      setCurrentQuestionIndex(questionIndex);
    },
  });

  subscribe({
    event: TimeUpEventKey,
    callback: nextQuestion,
  });

  return {
    currentQuestion,
  };
}
