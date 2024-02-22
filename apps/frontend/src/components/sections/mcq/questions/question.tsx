import React, { useEffect, useState } from 'react';
import { Card, CardBody } from '@nextui-org/react';
import { CountDown } from './count-down';
import { setState } from 'playroomkit';
import { CURRENT_QUESTION_STATE_KEY, QuestionState } from '../../../game';

interface Props {
  questionText: string;
  allowedTimeInMS: number;
}

export const Question: React.FC<Props> = ({
  questionText,
  allowedTimeInMS,
}) => {
  const [questionRemainingTime, setQuestionRemainingTime] =
    useState(allowedTimeInMS);

  // QUESTION SIDE EFFECTS
  useEffect(() => {
    if (questionRemainingTime === 0) {
      setState(CURRENT_QUESTION_STATE_KEY, QuestionState.MISSED);
    }
  }, [questionRemainingTime]);

  return (
    <Card
      isBlurred
      className="border-none dark:bg-primary-500/10 w-full p-8 rounded-lg backdrop-blur-[2px] relative overflow-visible"
      shadow="sm"
    >
      <div className="absolute -top-1/2 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-primary-900 rounded-full h-14 w-14 flex justify-center items-center">
        <CountDown
          milSecond={allowedTimeInMS}
          onUpdate={(remainingTime) => setQuestionRemainingTime(remainingTime)}
        />
      </div>

      <CardBody>
        <h2 className="text-xl font-normal text-center">{questionText}</h2>
      </CardBody>
    </Card>
  );
};
