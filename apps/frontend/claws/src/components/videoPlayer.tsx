import { useEffect, useRef, useState } from 'react';

import dynamic from 'next/dynamic';

// Define the props type
interface VideoPlayerProps {
  youtubeId: string | null;
  mute: boolean;
}

// Define the player ref type
interface Player {
  seekTo: (amount: number, type?: 'seconds' | 'fraction') => void;
}

const LazyReactPlayer = dynamic(() => import('react-player/youtube'), {
  ssr: false,
});

export default function VideoPlayer({ youtubeId, mute }: VideoPlayerProps) {
  const playerRef = useRef<Player | null>(null);
  const [playedSeconds, setPlayedSeconds] = useState(0);

  const handleProgress = (state: { playedSeconds: number }) => {
    setPlayedSeconds(state.playedSeconds);
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(playedSeconds, 'seconds');
    }
  }, [playedSeconds]);

  return (
    <LazyReactPlayer
      ref={playerRef}
      url={`https://www.youtube.com/watch?v=${youtubeId}`}
      controls={false}
      width="100%"
      height={460}
      muted={mute}
      stopOnUnmount={false}
      onProgress={handleProgress}
      config={{
        playerVars: {
          autoplay: 1,
        },
      }}
    />
  );
}
