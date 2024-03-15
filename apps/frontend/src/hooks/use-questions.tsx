'use client';
import { useCallback, useEffect, useState } from 'react';
import { IQuestion } from '../components/sections/mcq/questions/MCQQuestions';
import { gameSocket } from '@core/game-client';
import {
  PLAYER_COMMANDS,
  SOCKET_OP_CODES,
  SOCKET_SYNC,
} from '../components/match/match';
import { usePubSub } from './use-pub-sub';
import { useAppSelector } from './use-redux-typed';
import { PlayerScoreAction } from '../store/features/playersSlice';
import { Answer } from '../components/sections/mcq/answers/answer';
import { QuestionAnswerEventKeyFromChat } from './use-chat/use-chat-players';
import { MatchState } from '../store/features/matchSlice';

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
  const matchState = useAppSelector((state) => state.match.currentMatchState);
  const { publish, subscribe } = usePubSub();
  const [playersAnswered, setPlayersAnswered] = useState<string[]>([]);

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

  subscribe({
    event: QuestionAnswerEventKey,
    callback: ({ playerId, answer }: { playerId: string; answer: Answer }) => {
      syncPlayerScore({
        playerId,
        points: answer.isCorrect ? 1 : 0,
        answer,
        action: answer.isCorrect
          ? PlayerScoreAction.ADD
          : PlayerScoreAction.SUBTRACT,
      });
    },
  });

  subscribe({
    event: QuestionAnswerEventKeyFromChat,
    callback: ({
      playerId,
      abbreviation,
    }: {
      playerId: string;
      abbreviation: string;
    }) => {
      const answerIndex = abbreviationToIndex(abbreviation);
      if (answerIndex === -1) return;
      const answer = currentQuestion.answers[answerIndex];

      syncPlayerScore({
        playerId,
        points: answer.isCorrect ? 1 : 0,
        answer,
        action: answer.isCorrect
          ? PlayerScoreAction.ADD
          : PlayerScoreAction.SUBTRACT,
      });
    },
  });

  const syncPlayerScore = ({
    playerId,
    points,
    answer,
    action,
  }: {
    playerId: string;
    points: number;
    answer: Answer;
    action: PlayerScoreAction;
  }) => {
    if (matchState !== MatchState.STARTED) return;
    // if (playersAnswered.includes(playerId)) return;
    // setPlayersAnswered([...playersAnswered, playerId]);

    publish(PLAYER_COMMANDS.SYNC_SCORE, {
      id: playerId,
      points: answer.isCorrect ? 1 : 0,
      action: answer.isCorrect
        ? PlayerScoreAction.ADD
        : PlayerScoreAction.SUBTRACT,
    });
  };

  return {
    currentQuestion,
  };
}
function abbreviationToIndex(abbreviation: string) {
  switch (abbreviation) {
    case 'A':
      return 0;
    case 'B':
      return 1;
    case 'C':
      return 2;
    case 'D':
      return 3;
    default:
      return -1;
  }
}

function indexToAbbreviation(index: number) {
  switch (index) {
    case 0:
      return 'A';
    case 1:
      return 'B';
    case 2:
      return 'C';
    case 3:
      return 'D';
    default:
      return '';
  }
}
