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
    <div className="relative rounded-2xl bg-black overflow-hidden aspect-video shadow-xl border border-zinc-700">
      <div ref={ref} className="w-full h-full" />
    </div>
  );
  
  
};
