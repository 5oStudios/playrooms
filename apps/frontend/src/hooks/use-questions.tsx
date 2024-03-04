import { useState } from 'react';
import { IQuestion } from '../components/sections/mcq/questions/MCQQuestions';
import { gameSocket } from '@core/game-client';
import { numToUint8Array, uint8ArrayToNum } from '../utils/convert';
import { MatchOpCodes } from '../components/match/match';
import { Match, MatchData } from '@heroiclabs/nakama-js';
import { Answer } from '../components/sections/mcq/answers/answer';

export function useQuestions({
  questions,
  startingQuestionIndex = 0,
  match,
  isHost,
}: Readonly<{
  match: Match | null;
  questions: IQuestion[];
  startingQuestionIndex: number;
  isHost: boolean;
}>) {
  const [currentQuestion, setCurrentQuestion] = useState(questions[0]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    startingQuestionIndex
  );
  const [questionRemainingTime, setQuestionRemainingTime] = useState(
    currentQuestion.allowedTimeInMS
  );

  const questionStateHandler = (matchData: MatchData) => {
    console.log('next question');
    setCurrentQuestion(questions[uint8ArrayToNum(matchData.data)]);
    setCurrentQuestionIndex(uint8ArrayToNum(matchData.data));
  };

  const nextQuestion = () => {
    if (!isHost) return;
    setCurrentQuestion(questions[currentQuestionIndex + 1]);
    setCurrentQuestionIndex(currentQuestionIndex + 1);

    gameSocket.sendMatchState(
      match.match_id,
      MatchOpCodes.QUESTION_INDEX,
      numToUint8Array(currentQuestionIndex + 1)
    );
  };

  const previousQuestion = () => {
    setCurrentQuestion(questions[currentQuestionIndex - 1]);
    setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const handleAnswer = (answer: Answer) => {
    const deservedPoints =
      currentQuestion.allowedTimeInMS - questionRemainingTime;

    gameSocket.sendMatchState(
      match.match_id,
      MatchOpCodes.PLAYER_SCORE,
      numToUint8Array(deservedPoints)
    );
  };

  const onTimeTick = (remainingTime: number) => {
    setQuestionRemainingTime(remainingTime);
    if (remainingTime === 0) {
      nextQuestion();
    }
  };

  return {
    currentQuestion,
    nextQuestion,
    previousQuestion,
    isQuestionsFinished: currentQuestionIndex === questions.length - 1,
    currentQuestionDeservedPoints: 1,
    onTimeTick,
    handleAnswer,
    questionStateHandler,
  };
}
