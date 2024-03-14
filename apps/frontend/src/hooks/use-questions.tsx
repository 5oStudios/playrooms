'use client';
import { useCallback, useEffect, useState } from 'react';
import { IQuestion } from '../components/sections/mcq/questions/MCQQuestions';
import { gameSocket } from '@core/game-client';
import { numToUint8Array, uint8ArrayToNum } from '../utils/convert';
import { MatchOpCodes } from '../components/match/match';
import { MatchData } from '@heroiclabs/nakama-js';
import { usePubSub } from './use-pub-sub';
import { useAppSelector } from './use-redux-typed';

export const QuestionsFinishedEventKey = 'questions_finished';
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
  const { publish } = usePubSub();

  const questionsSocketEventsReceiver = (matchData: MatchData) => {
    setCurrentQuestion(questions[uint8ArrayToNum(matchData.data)]);
    setCurrentQuestionIndex(uint8ArrayToNum(matchData.data));
  };

  const nextQuestion = useCallback(() => {
    if (!amIHost) return;
    setCurrentQuestion(questions[currentQuestionIndex + 1]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    gameSocket.sendMatchState(
      match?.match_id,
      MatchOpCodes.QUESTION_INDEX,
      numToUint8Array(currentQuestionIndex + 1)
    );
  }, [amIHost, currentQuestionIndex, match?.match_id, questions]);

  useEffect(() => {
    if (currentQuestionIndex === questions.length - 1) {
      publish(QuestionsFinishedEventKey, true);
    }
  }, [currentQuestionIndex, publish, questions, questions.length]);

  return {
    currentQuestion,
    nextQuestion,
    // currentQuestionDeservedPoints: 1,
    questionsSocketEventsReceiver,
  };
}
