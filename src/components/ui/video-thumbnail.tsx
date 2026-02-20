interface VideoThumbnailProps {
  url: string;
  image: string;
  alt?: string;
}

export function VideoThumbnail({ url, image, alt = 'Video demo' }: VideoThumbnailProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'relative',
        display: 'block',
        margin: '1.5em 0',
        borderRadius: 8,
        overflow: 'hidden',
        borderBottom: 'none',
      }}
    >
      <img
        src={image}
        alt={alt}
        style={{ display: 'block', margin: 0, width: '100%' }}
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
    </a>
  );
}
