import { Dispatch } from 'react';

import Image from 'next/image';

import info from '../../public/assets/videoControl/info.svg';
import muteSvg from '../../public/assets/videoControl/mute.svg';
import volumeHigh from '../../public/assets/videoControl/volume-high.svg';

type VideoControlProps = {
  mute: boolean;
  setMute: Dispatch<React.SetStateAction<boolean>>;
};

export default function VideoControl({ mute, setMute }: VideoControlProps) {
  return (
    <div className="absolute flex flex-col gap-2 right-2 bottom-32 z-30">
      <button className="bg-white p-1 rounded-full">
        <Image src={info} alt={'info'} />
      </button>

      <button
        className={
          mute
            ? 'bg-gradient-to-t from-secondary to-darkYellow p-1 rounded-full'
            : 'bg-white p-1 rounded-full'
        }
        onClick={() => setMute((data) => !data)}
      >
        {mute ? (
          <Image src={muteSvg} alt={'mute'} />
        ) : (
          <Image src={volumeHigh} alt={'volume'} />
        )}
      </button>
    </div>
  );
}
