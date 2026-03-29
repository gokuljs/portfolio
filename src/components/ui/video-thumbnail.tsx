'use client';

interface VideoThumbnailProps {
  url: string;
  image?: string;
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

export function VideoThumbnail({ url, alt = 'Video' }: VideoThumbnailProps) {
  const videoId = extractYouTubeId(url);
  const embedUrl = videoId
    ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    : url;

  return (
    <figure style={{ margin: '2em 0' }}>
      <div style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0 }}>
        <iframe
          src={embedUrl}
          title={alt}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            borderRadius: '6px',
          }}
        />
      </div>
      {alt && alt !== 'Video' && (
        <figcaption style={{
          marginTop: '0.6em',
          fontSize: '12px',
          color: '#9ca3af',
          fontFamily: 'system-ui, sans-serif',
          fontStyle: 'italic',
          textAlign: 'center',
        }}>
          {alt}
        </figcaption>
      )}
    </figure>
  );
}
