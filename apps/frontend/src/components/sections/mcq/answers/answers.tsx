import { Card, CardBody } from '@nextui-org/react';
import { Answer } from './answer';
import React from 'react';
import { QuestionState } from '../questions/question';
import { useMultiplayerState } from 'playroomkit';

export function Answers({
  answers,
  onClick,
}: Readonly<{
  answers: Answer[];
  onClick: (answer: Answer) => void;
}>) {
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
      className="border-none dark:bg-neutral-950/10  max-w-[610px] p-2 rounded-lg backdrop-blur-[2px]"
      shadow="sm"
    >
      <CardBody>
        <div className="grid grid-cols-1 gap-4">
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
}
