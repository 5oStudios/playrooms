import { useEffect, useState } from 'react';
import { IQuestion } from '../components/sections/mcq/questions/MCQQuestions';
import { gameSocket } from '@core/game-client';
import { numToUint8Array, uint8ArrayToNum } from '../utils/convert';
import { MatchOpCodes } from '../components/match/match';
import { MatchData } from '@heroiclabs/nakama-js';
import { usePubSub } from './use-pub-sub';
import { useAppSelector } from './use-redux-typed';

export const QuestionsFinishedEventKey = 'questions_finished';
export function useQuestions({
  questions,
  startingQuestionIndex = 0,
  amIHost,
}: Readonly<{
  questions: IQuestion[];
  startingQuestionIndex: number;
  amIHost: boolean;
}>) {
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

  const nextQuestion = () => {
    if (!amIHost) return;
    setCurrentQuestion(questions[currentQuestionIndex + 1]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);

    gameSocket.sendMatchState(
      match.match_id,
      MatchOpCodes.QUESTION_INDEX,
      numToUint8Array(currentQuestionIndex + 1)
    );
  };

  useEffect(() => {
    if (currentQuestionIndex === questions.length - 1) {
      publish(QuestionsFinishedEventKey, true);
    }
  }, [currentQuestionIndex, publish, questions.length]);

  return {
    currentQuestion,
    nextQuestion,
    // currentQuestionDeservedPoints: 1,
    questionsSocketEventsReceiver,
  };
}
