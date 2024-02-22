import { Card, CardBody } from '@nextui-org/react';
import { Answer } from './answer';
import React from 'react';
import { getState } from 'playroomkit';
import { CURRENT_QUESTION_STATE_KEY } from '../../../game';

export function Answers({
  answers,
  onClick,
}: Readonly<{
  answers: Answer[];
  onClick: (answer: Answer) => void;
}>) {
  const currentQuestionState = getState(CURRENT_QUESTION_STATE_KEY);

  return (
    <Card
      isBlurred
      className="border-none dark:bg-primary-500/10 max-w-[610px] rounded-lg backdrop-blur-[2px]"
      shadow="sm"
    >
      <CardBody>
        <div className="grid grid-cols-1 gap-4">
          {answers.map((answer, index) => (
            <Answer
              key={index}
              answer={answer}
              onClick={onClick}
              index={index}
              currentQuestionState={currentQuestionState}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
