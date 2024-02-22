import React from 'react';
import { setState, useMultiplayerState } from 'playroomkit';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';

const renderTime = (dimension, time) => {
  return <span className={'text-white text-center'}>{time}</span>;
};

export function CountDown({ milSecond }: Readonly<{ milSecond: number }>) {
  const [timer, setTimer] = useMultiplayerState('timer', milSecond);

  return (
    <CountdownCircleTimer
      isPlaying={true}
      colors={`#0ea5e9`}
      isSmoothColorTransition={true}
      strokeWidth={4}
      size={42}
      duration={milSecond / 1000}
      initialRemainingTime={milSecond / 1000}
      onComplete={() => {
        setState('isTimeUp', true);
        return {
          shouldRepeat: false,
        };
      }}
      onUpdate={(elapsedTime) => {
        setTimer(elapsedTime);
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
