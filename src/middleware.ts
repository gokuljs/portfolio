import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BLOCKED_IPS = new Set(['122.161.52.104', '49.206.134.154']);

const BOT_USER_AGENTS =
  /googlebot|google-inspectiontool|storebot-google|googleother|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver|linkedinbot|twitterbot|applebot|semrushbot|ahrefsbot|mj12bot|dotbot/i;

function isSearchBot(request: NextRequest): boolean {
  const ua = request.headers.get('user-agent') ?? '';
  return BOT_USER_AGENTS.test(ua);
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('x-real-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  );
}

function isResumeAccessAllowed(request: NextRequest): boolean {
  if (isSearchBot(request)) return true;

  const country = request.headers.get('x-vercel-ip-country') ?? '';
  const region = request.headers.get('x-vercel-ip-country-region') ?? '';

  if (country !== 'IN') return true;

  if (region === 'KA') return true;

  return false;
}

export function middleware(request: NextRequest) {
  const ip = getClientIp(request);

  if (BLOCKED_IPS.has(ip)) {
    return new NextResponse('Access Denied', { status: 403 });
  }

  if (request.nextUrl.pathname === '/GokulJS.pdf' && !isResumeAccessAllowed(request)) {
    return NextResponse.rewrite(new URL('/?resume=blocked', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
