'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

import { Controls } from '../components/controls';
import Header from '../components/header';
import styles from './page.module.css';

export default function Index() {
  const LazyReactPlayer = dynamic(() => import('react-player/youtube'), {
    ssr: false,
  });

  const searchParams = useSearchParams();
  const youtubeId = searchParams.get('yt');

  // const { w, a, s, d, arrowleft, arrowright, arrowup, arrowdown } = useWASD();
  //
  // console.log({ w, a, s, d, arrowleft, arrowright, arrowup, arrowdown });
  return (
    <div>
      <Header viewers={20} waiting={20} />
      <LazyReactPlayer
        url={`https://www.youtube.com/watch?v=${youtubeId}`}
        controls={false}
        width="100%"
        height={460}
        muted={true}
        stopOnUnmount={false}
        config={{
          playerVars: {
            autoplay: 1,
          },
        }}
      />
      <Controls />
      <div className="flex flex-col items-center mt-[19px]">
        <button className="bg-gradient-to-t from-secondary to-darkYellow w-[380px] h-[58px] rounded-xl">
          Join Play
        </button>
        <button className="mt-4 flex justify-center items-center button-gradient-border w-[380px] h-[58px] rounded-xl">
          Queue Board
        </button>
      </div>
    </div>
  );
}
