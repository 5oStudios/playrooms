import React from 'react';
import { useMultiplayerState } from 'playroomkit';
import { Answer } from './answer';
import { Card, CardBody, CardHeader } from '@nextui-org/react';

interface Props {
  questionData: QuestionData;
  onClick: (answer: Answer) => void;
}

export interface QuestionData {
  question: string;
  answers: Answer[];
}
export enum QuestionState {
  UNANSWERED = 'UNANSWERED',
  CORRECT = 'CORRECT',
  INCORRECT = 'INCORRECT',
}

export const Question: React.FC<Props> = ({ questionData, onClick }) => {
  const { question, answers } = questionData;
  const [currentQuestionState, setCurrentQuestionState] = useMultiplayerState(
    'currentQuestionState',
    QuestionState.UNANSWERED
  );
  const handleAnswer = (answer: Answer) => {
    onClick(answer);
    if (answer.isCorrect) {
      setCurrentQuestionState(QuestionState.CORRECT);
    } else {
      setCurrentQuestionState(QuestionState.INCORRECT);
    }
  };
  return (
    <Card
      isBlurred
      className="border-none bg-neutral-950/60 dark:bg-default-100/45 max-w-[610px] p-8 rounded-lg backdrop-blur-[2px]"
      shadow="sm"
    >
      <CardHeader className="flex gap-3 mb-6">
        <h2 className="text-2xl font-bold">{question}</h2>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 gap-4">
          {answers.map((answer, index) => (
            <Answer
              key={index}
              answer={answer}
              onClick={handleAnswer}
              index={index}
              currentQuestionState={currentQuestionState}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
};
