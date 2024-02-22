import React from 'react';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { getState } from 'playroomkit';
import { CURRENT_GAME_STATE_KEY, GAME_STATE } from '../../../game';

const renderTime = (dimension, time) => {
  return <span className={'text-white text-center'}>{time}</span>;
};

export function CountDown({
  milSecond,
  onUpdate,
}: Readonly<{ milSecond: number; onUpdate: (remainingTime: number) => void }>) {
  return (
    <CountdownCircleTimer
      isPlaying={getState(CURRENT_GAME_STATE_KEY) === GAME_STATE.STARTED}
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
