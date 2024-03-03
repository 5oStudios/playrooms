import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const renderTime = (dimension, time) => {
  return <span className={'text-white text-center'}>{time}</span>;
};

export function CountDown({
  milSecond,
  onUpdate,
  isMatchStarted,
}: Readonly<{
  milSecond: number;
  onUpdate: (remainingTime: number) => void;
  isMatchStarted: boolean;
}>) {
  return (
    <CountdownCircleTimer
      isPlaying={isMatchStarted}
      colors={`#0ea5e9`}
      isSmoothColorTransition={true}
      strokeWidth={4}
      size={42}
      duration={milSecond / 1000}
      initialRemainingTime={milSecond / 1000}
      onComplete={() => {
        return {
          shouldRepeat: true,
        };
      }}
      onUpdate={(elapsedTime) => {
        onUpdate(elapsedTime);
      }}
    >
      {({ elapsedTime, color }) => (
        <span style={{ color }}>
          {renderTime(
            'seconds',
            ((milSecond - Math.floor(elapsedTime * 1000)) / 1000).toFixed(1)
          )}
        </span>
      )}
    </CountdownCircleTimer>
  );
}
