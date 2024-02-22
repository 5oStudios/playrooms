import React from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { CountDown } from './count-down';

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
      className="border-none dark:bg-primary-500/10 max-w-[610px] p-8 rounded-lg backdrop-blur-[2px] relative overflow-visible"
      shadow="sm"
    >
      <div className="absolute -top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-primary-900 rounded-full h-14 w-14 flex justify-center items-center">
        <CountDown milSecond={5000} />
      </div>

      <CardBody>
        <h2 className="text-xl font-normal text-center">{questionText}</h2>
      </CardBody>
    </Card>
  );
};
