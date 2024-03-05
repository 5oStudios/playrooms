import { useEffect, useState } from 'react';
import { IQuestion } from '../components/sections/mcq/questions/MCQQuestions';
import { gameSocket } from '@core/game-client';
import { numToUint8Array, uint8ArrayToNum } from '../utils/convert';
import { MatchOpCodes } from '../components/match/match';
import { Match, MatchData } from '@heroiclabs/nakama-js';
import { usePubSub } from './use-pub-sub';

export const QuestionsFinishedEventKey = 'questions_finished';
export function useQuestions({
  questions,
  startingQuestionIndex = 0,
  match,
  amIHost,
}: Readonly<{
  match: Match | null;
  questions: IQuestion[];
  startingQuestionIndex: number;
  amIHost: boolean;
}>) {
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    startingQuestionIndex
  );
  const { publish } = usePubSub();

  const questionsEventsReceiver = (matchData: MatchData) => {
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
    questionsEventsReceiver,
  };
}
