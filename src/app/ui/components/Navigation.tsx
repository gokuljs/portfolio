import Link from 'next/link';

export default function Navigation() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: '2rem',
        right: '2rem',
        zIndex: 1000,
        display: 'flex',
        gap: '1rem',
        background: 'rgba(20, 20, 20, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0.5rem',
        padding: '0.75rem 1rem',
      }}
    >
      <Link
        href="/"
        style={{
          color: '#ffffff',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: '500',
          transition: 'color 0.2s ease',
        }}
      >
        Home
      </Link>
      <Link
        href="/changelog"
        style={{
          color: '#ffffff',
          textDecoration: 'none',
          fontSize: '0.875rem',
          fontWeight: '500',
          transition: 'color 0.2s ease',
        }}
      >
        Changelog
      </Link>
    </nav>
  );
}
