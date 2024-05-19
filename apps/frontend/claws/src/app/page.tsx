'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';

import { Controls } from '../components/controls';
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
    <div className={styles.page}>
      <div className="wrapper">
        <div className="container">
          <div id="welcome">
            <h1>
              <span> Hello there, </span>
              Welcome To Claws Game👋
            </h1>
          </div>

          <div id="hero">
            <LazyReactPlayer
              url={`https://www.youtube.com/watch?v=${youtubeId}`}
              controls={false}
              width="100%"
              muted={true}
              stopOnUnmount={false}
              config={{
                playerVars: {
                  autoplay: 1,
                },
              }}
            />
          </div>
          <div
            style={{
              marginTop: '20px',
            }}
          >
            <Controls />
          </div>

          <p id="love">
            Carefully crafted with
            <svg
              fill="currentColor"
              stroke="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </p>
        </div>
      </div>
    </div>
  );
}
