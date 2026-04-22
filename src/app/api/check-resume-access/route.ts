import { NextRequest, NextResponse } from 'next/server';
import { isTimezoneMismatch } from '@/lib/vpn-detection';

export async function GET(req: NextRequest) {
  const country = req.headers.get('x-vercel-ip-country') ?? '';
  const region = req.headers.get('x-vercel-ip-country-region') ?? '';
  const browserTimezone = req.nextUrl.searchParams.get('tz') ?? '';

  // Timezone mismatch = likely VPN
  if (browserTimezone && isTimezoneMismatch(country, browserTimezone)) {
    return NextResponse.json({ allowed: false, reason: 'vpn' });
  }

  if (country !== 'IN') {
    return NextResponse.json({ allowed: true });
  }

  if (region === 'KA') {
    return NextResponse.json({ allowed: true });
  }

  return NextResponse.json({ allowed: false, reason: 'region' });
}
