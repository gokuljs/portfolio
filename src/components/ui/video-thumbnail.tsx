'use client';

import { useState } from 'react';

interface VideoThumbnailProps {
  url: string;
  image: string;
  alt?: string;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function VideoThumbnail({ url, image, alt = 'Video demo' }: VideoThumbnailProps) {
  const [playing, setPlaying] = useState(false);
  const videoId = extractYouTubeId(url);

  if (playing && videoId) {
    return (
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '100%',
        aspectRatio: '16 / 9',
        margin: '1.5em 0',
        borderRadius: 8,
        overflow: 'hidden',
      }}>
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={alt}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      style={{
        position: 'relative',
        display: 'block',
        width: '100%',
        maxWidth: '100%',
        margin: '1.5em 0',
        borderRadius: 8,
        overflow: 'hidden',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        background: 'transparent',
      }}
      aria-label={`Play video: ${alt}`}
    >
      <img
        src={image}
        alt={alt}
        style={{ display: 'block', margin: 0, width: '100%', maxWidth: '100%', height: 'auto' }}
      />
      {/* dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.35)',
      }} />
      {/* play button */}
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: 'rgba(200,240,220,0.15)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(200,240,220,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" style={{ marginLeft: 3 }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
    </button>
  );
}
