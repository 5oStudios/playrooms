import React from 'react';
import { Card, CardBody } from '@nextui-org/react';

interface Props {
  questionText: string;
}
export enum QuestionState {
  UNANSWERED = 'UNANSWERED',
  CORRECT = 'CORRECT',
  INCORRECT = 'INCORRECT',
}

export const Question: React.FC<Props> = ({ questionText }) => {
  return (
    <Card
      isBlurred
      className="border-none dark:bg-primary-500/10 max-w-[610px] p-8 rounded-lg backdrop-blur-[2px]"
      shadow="sm"
    >
      <CardBody>
        <h2 className="text-xl font-normal text-center">{questionText}</h2>
      </CardBody>
    </Card>
  );
};
