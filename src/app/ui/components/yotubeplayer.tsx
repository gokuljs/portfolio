'use client';
import { useState } from 'react';

const YouTubePlayer = ({ videoId }: { videoId: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <div
      className="relative w-full rounded-lg border border-neutral-800 overflow-hidden"
      style={{ aspectRatio: '16/9' }}
    >
      {!isPlaying ? (
        <div
          className="relative w-full h-full cursor-pointer"
          onClick={handlePlay}
        >
          <img
            src={'/video-poster.jpg'}
            alt="YouTube Video Thumbnail"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="white"
                className="w-8 h-8 md:w-10 md:h-10 ml-1"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-10"></div>
        </div>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )}
    </div>
  );
};

export default YouTubePlayer;
