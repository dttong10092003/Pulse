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
    <div className="relative rounded-xl overflow-hidden bg-gray-300 aspect-video w-full">
      <div ref={ref} className="w-full h-full object-cover" />
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-md text-xs flex items-center gap-1">
        <span className="text-white/80">{user.uid}</span>
      </div>
    </div>
  );
};
