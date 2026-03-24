import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const BOT_USER_AGENTS =
  /googlebot|google-inspectiontool|storebot-google|googleother|bingbot|slurp|duckduckbot|baiduspider|yandexbot|sogou|exabot|facebot|ia_archiver|linkedinbot|twitterbot|applebot|semrushbot|ahrefsbot|mj12bot|dotbot/i;

function isSearchBot(request: NextRequest): boolean {
  const ua = request.headers.get('user-agent') ?? '';
  return BOT_USER_AGENTS.test(ua);
}

function isResumeAccessAllowed(request: NextRequest): boolean {
  // Always allow search engine crawlers so they can index the PDF without a redirect
  if (isSearchBot(request)) return true;

  const country = request.headers.get('x-vercel-ip-country') ?? '';
  const region = request.headers.get('x-vercel-ip-country-region') ?? '';

  // Allow if visitor is outside India
  if (country !== 'IN') return true;

  // Allow only Karnataka (Bangalore) within India
  if (region === 'KA') return true;

  // Block all other Indian states
  return false;
}

export function middleware(request: NextRequest) {
  if (!isResumeAccessAllowed(request)) {
    return NextResponse.rewrite(new URL('/?resume=blocked', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/GokulJS.pdf',
};
