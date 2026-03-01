import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

function isResumeAccessAllowed(request: NextRequest): boolean {
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
    return NextResponse.redirect(new URL('/?resume=blocked', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/GokulJS.pdf',
};
