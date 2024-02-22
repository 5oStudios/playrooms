import { Question } from './question';
import { Answers } from '../answers/answers';
import { myPlayer, setState, useMultiplayerState } from 'playroomkit';
import React, { useEffect } from 'react';
import {
  ALLOWED_TIME_IN_MS_KEY,
  CURRENT_QUESTION_STATE_KEY,
  PLAYER_SCORE_KEY,
  QuestionState,
} from '../../../game';

export interface IQuestion {
  question: string;
  answers: Answer[];
  correctAnswer: string;
  difficultyLevel: string;
  allowedTimeInMS: number;
}

export interface Answer {
  option: string;
  isCorrect: boolean;
}
const ALLOWED_TIME_IN_MS = 5000;
const STARTING_QUESTION_INDEX = 0;
const CURRENT_QUESTION_INDEX_KEY = 'currentQuestionIndex';

export function MCQQuestions({
  questions,
}: Readonly<{
  questions: IQuestion[];
}>) {
  const [allowedTimeInMS] = useMultiplayerState(
    ALLOWED_TIME_IN_MS_KEY,
    ALLOWED_TIME_IN_MS
  );
  const [currentQuestionState] = useMultiplayerState(
    CURRENT_QUESTION_STATE_KEY,
    QuestionState.UNANSWERED
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useMultiplayerState(
    CURRENT_QUESTION_INDEX_KEY,
    STARTING_QUESTION_INDEX
  );

  // QUESTION SIDE EFFECTS
  useEffect(() => {
    // console.log('currentQuestionState', currentQuestionState);
    // console.log('currentQuestionIndex', currentQuestionIndex);
    const nextQuestion = () => {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setState(CURRENT_QUESTION_STATE_KEY, QuestionState.UNANSWERED);
    };
    switch (currentQuestionState) {
      case QuestionState.MISSED:
        nextQuestion();
        break;
      case QuestionState.CORRECT:
        nextQuestion();
        myPlayer().setState(
          PLAYER_SCORE_KEY,
          myPlayer().getState(PLAYER_SCORE_KEY) + 1
        );
        break;
    }
  }, [currentQuestionState]);
  return (
    <div className="flex flex-col gap-2">
      <Question
        questionText={questions[currentQuestionIndex].question}
        allowedTimeInMS={allowedTimeInMS}
      />
      <Answers
        answers={questions[currentQuestionIndex].answers}
        onClick={(answer) => {
          switch (answer.isCorrect) {
            case true:
              setState(CURRENT_QUESTION_STATE_KEY, QuestionState.CORRECT);
              break;
            case false:
              setState(CURRENT_QUESTION_STATE_KEY, QuestionState.INCORRECT);
              break;
          }
        }}
      />
    </div>
  );
}
