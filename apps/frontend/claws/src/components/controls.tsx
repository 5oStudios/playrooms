import Image from 'next/image';

import arrowDown from '../../public/assets/controls/arrowDown.svg';
import arrowLeft from '../../public/assets/controls/arrowLeft.svg';
import arrowRight from '../../public/assets/controls/arrowRight.svg';
import arrowUp from '../../public/assets/controls/arrowUp.svg';
import dropClaw from '../../public/assets/controls/drop.svg';
import { cn } from '../utils';

// import {
//   clawsControls,
//   down,
//   drop,
//   left,
//   right,
//   up,
// } from '../services/claws-controls';
//
// const controls = [
//   {
//     keys: ['w', 'arrowup'],
//     handler: clawsControls().up,
//   },
//   {
//     keys: ['s', 'arrowdown'],
//     handler: clawsControls().down,
//   },
//   {
//     keys: ['a', 'arrowleft'],
//     handler: clawsControls().left,
//   },
//   {
//     keys: ['d', 'arrowright'],
//     handler: clawsControls().right,
//   },
// ];

export const Controls = ({
  actions,
  disabled,
}: {
  actions: {
    up: () => void;
    down: () => void;
    left: () => void;
    right: () => void;
    drop: () => void;
  };
  disabled: {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    drop: boolean;
  };
}) => {
  const { up, down, left, right, drop } = actions;
  const {
    up: upDisabled,
    down: downDisabled,
    left: leftDisabled,
    right: rightDisabled,
    drop: dropDisabled,
  } = disabled;

  const buttonStyles = cn(
    'flex justify-center items-center bg-primary w-10 h-10 rounded-xl shadow-lg shadow-gray-600',
  );
  const transition = 'transition duration-100 ease-in-out hover:scale-105';
  const opacity = 'opacity-50';

  return (
    <div className="flex mt-9 w-full justify-center items-center">
      <div className="flex flex-col w-[149px] h-[120px] items-center mr-[50px]">
        <button
          onClick={up}
          disabled={upDisabled}
          className={cn(buttonStyles, upDisabled ? opacity : transition)}
        >
          <Image src={arrowUp} alt={'up arrow'} />
        </button>
        <div className="flex w-[149px] justify-between">
          <button
            onClick={left}
            disabled={leftDisabled}
            className={cn(buttonStyles, leftDisabled ? opacity : transition)}
          >
            <Image src={arrowLeft} alt={'left arrow'} />
          </button>
          <button
            onClick={right}
            disabled={rightDisabled}
            className={cn(buttonStyles, rightDisabled ? opacity : transition)}
          >
            <Image src={arrowRight} alt={'right arrow'} />
          </button>
        </div>
        <button
          onClick={down}
          disabled={downDisabled}
          className={cn(buttonStyles, downDisabled ? opacity : transition)}
        >
          <Image src={arrowDown} alt={'down arrow'} />
        </button>
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={drop}
          disabled={dropDisabled}
          className={cn(
            buttonStyles,
            dropDisabled ? opacity : transition,
            'w-[52px] h-[86px]',
          )}
        >
          <Image src={dropClaw} alt={'drop claw'} />
        </button>
        <p className="text-primary font-semibold text-3xl mt-4">Drop</p>
      </div>
    </div>
  );
};
