// VideoPlayer.tsx
import React, { useEffect, useRef } from 'react';

interface VideoPlayerProps {
  user: {
    uid: string | number;
    videoTrack: {
      play: (element: HTMLElement) => void;
    };
    audioTrack?: {
      play: () => void;
    };
  };
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ user }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      user.videoTrack.play(ref.current);
    }
    user.audioTrack?.play();
  }, [user]);

  return (
<div className="w-full aspect-square bg-black relative rounded-xl overflow-hidden shadow-lg">
      <div ref={ref} className="absolute inset-0 w-full h-full" />
    </div>
  );

  
  
};
