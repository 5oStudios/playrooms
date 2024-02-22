import Countdown from 'react-countdown';
import React from 'react';
import { setState, useMultiplayerState } from 'playroomkit';

export function CountDown({ time }: Readonly<{ time: number }>) {
  const [timer, setTimer] = useMultiplayerState('timer', time);

  return (
    <p className="text-lg">
      Time remaining:{' '}
      <span className="font-bold" id="score">
        <Countdown
          renderer={Counter}
          onTick={(time) => {
            setTimer(time.seconds);
          }}
          date={Date.now() + timer * 1000}
          onComplete={() => {
            setState('isTimeUp', true);
          }}
        />
      </span>
    </p>
  );
}

function Counter({ seconds = 0 }) {
  return seconds;
}
