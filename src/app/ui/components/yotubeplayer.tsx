'use client';
import { PlayIcon } from '@radix-ui/react-icons';
import Image from 'next/image';
import { useState } from 'react';

const YouTubePlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = 'YX9pgiaIiSI';
  const posterImage = '/video-poster.jpg'; // your custom image path

  return (
    <div
      className="relative w-full rounded-lg border border-neutral-800 overflow-hidden"
      style={{ aspectRatio: '16/9' }}
    >
      {!isPlaying ? (
        <div
          className="w-full h-full relative cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          <Image
            width={1000}
            height={1000}
            src={posterImage}
            alt="Custom Video Thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="w-[100px] h-[100px] rounded-full z-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-stone-100/50 via-stone-900/10 to-white/50 flex items-center justify-center">
            <PlayIcon className="w-10 h-10 text-neutral-900" />
          </div>
        </div>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default YouTubePlayer;
