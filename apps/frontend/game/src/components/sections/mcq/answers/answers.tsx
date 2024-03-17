import { Card, CardBody } from '@nextui-org/react';
import { Answer } from './answer';
import React from 'react';
import { IAnswer } from '../../../../hooks/use-questions';

export function Answers({
  answers,
  onClick,
}: Readonly<{
  answers: IAnswer[];
  onClick: (answerAbb: string) => void;
}>) {
  const [isOneAnswerSelected, setIsOneAnswerSelected] = React.useState(false);

  return (
    <Card
      isBlurred
      className="border-none dark:bg-primary-500/10 rounded-lg backdrop-blur-[2px]"
      shadow="sm"
    >
      <CardBody>
        <div className="grid grid-cols-1 gap-4">
          {answers.map((answer, index) => (
            <Answer
              key={index}
              answer={answer}
              onClick={(answerAbb) => {
                onClick(answerAbb);
                setIsOneAnswerSelected(true);
              }}
              index={index}
              disabled={isOneAnswerSelected}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
