interface ThemeImageProps {
  lightSrc: string;
  darkSrc: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ThemeImage({ lightSrc, darkSrc, alt, className, style }: ThemeImageProps) {
  return (
    <>
      <img
        src={lightSrc}
        alt={alt}
        className={`theme-img-light${className ? ` ${className}` : ''}`}
        style={style}
      />
      <img
        src={darkSrc}
        alt={alt}
        className={`theme-img-dark${className ? ` ${className}` : ''}`}
        style={style}
      />
    </>
  );
}
