import { useEffect, useState } from 'react';

import Image from 'next/image';

import arrowDown from '../../public/assets/controls/arrowDown.svg';
import arrowLeft from '../../public/assets/controls/arrowLeft.svg';
import arrowRight from '../../public/assets/controls/arrowRight.svg';
import arrowUp from '../../public/assets/controls/arrowUp.svg';
import dropClaw from '../../public/assets/controls/drop.svg';
import {
  moveClaws,
  selectMyPlayerState,
} from '../lib/features/rooms/joinedRoomSlice';
import { useAppDispatch, useAppSelector } from '../lib/hooks';
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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const Controls = ({}) => {
  const dispatch = useAppDispatch();
  const isMyTurn = useAppSelector(
    (state) => selectMyPlayerState(state)?.isMyTurn,
  );
  const [controlDisabled, setControlDisabled] = useState({
    up: true,
    down: true,
    left: true,
    right: true,
    drop: true,
  });

  useEffect(() => {
    if (isMyTurn) {
      setControlDisabled({
        up: false,
        down: false,
        left: false,
        right: true,
        drop: true,
      });
    } else {
      setControlDisabled({
        up: true,
        down: true,
        left: true,
        right: true,
        drop: true,
      });
    }
  }, [isMyTurn]);

  const buttonStyles = cn(
    'flex justify-center items-center bg-primary w-10 h-10 rounded-xl shadow-lg shadow-gray-600',
  );
  const transition = 'transition duration-100 ease-in-out hover:scale-105';
  const opacity = 'opacity-50';

  return (
    <div className="flex mt-9 w-full justify-center items-center">
      <div className="flex flex-col w-[149px] h-[120px] items-center mr-[50px]">
        <button
          onClick={() => {
            dispatch(moveClaws('up'));
            setControlDisabled({ ...controlDisabled, drop: false });
          }}
          disabled={controlDisabled.up}
          className={cn(
            buttonStyles,
            controlDisabled.up ? opacity : transition,
          )}
        >
          <Image src={arrowUp} alt={'up arrow'} />
        </button>
        <div className="flex w-[149px] justify-between">
          <button
            onClick={() => {
              dispatch(moveClaws('left'));
              setControlDisabled({ ...controlDisabled, drop: false });
            }}
            disabled={controlDisabled.left}
            className={cn(
              buttonStyles,
              controlDisabled.left ? opacity : transition,
            )}
          >
            <Image src={arrowLeft} alt={'left arrow'} />
          </button>
          <button
            onClick={() => {
              dispatch(moveClaws('right'));
              setControlDisabled({ ...controlDisabled, drop: false });
            }}
            disabled={controlDisabled.right}
            className={cn(
              buttonStyles,
              controlDisabled.right ? opacity : transition,
            )}
          >
            <Image src={arrowRight} alt={'right arrow'} />
          </button>
        </div>
        <button
          onClick={() => {
            dispatch(moveClaws('down'));
            setControlDisabled({ ...controlDisabled, drop: false });
          }}
          disabled={controlDisabled.down}
          className={cn(
            buttonStyles,
            controlDisabled.down ? opacity : transition,
          )}
        >
          <Image src={arrowDown} alt={'down arrow'} />
        </button>
      </div>

      <div className="flex flex-col items-center">
        <button
          onClick={async () => {
            dispatch(moveClaws('drop'));
            await wait(500);
            setControlDisabled({
              up: true,
              down: true,
              left: true,
              right: true,
              drop: true,
            });
          }}
          disabled={controlDisabled.drop}
          className={cn(
            buttonStyles,
            controlDisabled.drop ? opacity : transition,
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
