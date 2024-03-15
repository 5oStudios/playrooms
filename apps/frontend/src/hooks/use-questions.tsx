'use client';
import { useCallback, useEffect, useState } from 'react';
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
import { IQuestion } from '../components/sections/mcq/questions/MCQQuestions';
import { ChatAnswerState } from './use-chat/use-chat';

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
  }, [currentQuestionIndex, publish, questions, questions.length]);

  subscribe({
    event: SOCKET_SYNC.QUESTION_INDEX,
    callback: (decodedData: string) => {
      const questionIndex = parseInt(decodedData);
      setCurrentQuestion(questions[questionIndex]);
      setCurrentQuestionIndex(questionIndex);
      setPlayersAnswered([]);
    },
  });

  subscribe({
    event: TimeUpEventKey,
    callback: nextQuestion,
  });

  subscribe({
    event: QuestionAnswerEventKey,
    callback: ({ playerId, answer }: { playerId: string; answer: Answer }) => {
      console.log('QuestionAnswerEventKey', playerId, answer);
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
      msgId,
    }: {
      playerId: string;
      abbreviation: string;
      msgId: string;
    }) => {
      const answerIndex = abbreviationToIndex(abbreviation);
      console.log('QuestionAnswerEventKeyFromChat', playerId, answerIndex);

      if (playersAnswered.includes(playerId)) {
        console.log('player already answered', playersAnswered);
        return;
      }
      const answer = currentQuestion.answers[answerIndex];
      if (!answer) {
        console.log('invalid answer index', answerIndex);
        return;
      }

      publish('chat_answer_state', {
        playerId,
        msgId,
        state: ChatAnswerState.PROCESSING,
      });
      const isCorrect = answer.isCorrect;
      isCorrect &&
        publish('chat_answer_state', {
          playerId,
          msgId,
          state: ChatAnswerState.CORRECT,
        });
      syncPlayerScore({
        playerId,
        points: isCorrect ? 1 : 0,
        answer,
        action: isCorrect ? PlayerScoreAction.ADD : PlayerScoreAction.SUBTRACT,
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
    if (playersAnswered.includes(playerId)) return;
    setPlayersAnswered([...playersAnswered, playerId]);

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
  if (abbreviation.match(patterns.A)) return 0;
  if (abbreviation.match(patterns.B)) return 1;
  if (abbreviation.match(patterns.C)) return 2;
  if (abbreviation.match(patterns.D)) return 3;
}

function indexToAbbreviation(index: number) {
  return ['A', 'B', 'C', 'D'][index];
}
