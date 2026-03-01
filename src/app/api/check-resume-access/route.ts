import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const country = req.headers.get('x-vercel-ip-country') ?? '';
  const region = req.headers.get('x-vercel-ip-country-region') ?? '';

  // Allow outside India
  if (country !== 'IN') {
    return NextResponse.json({ allowed: true });
  }

  // Allow Karnataka (Bangalore) within India
  if (region === 'KA') {
    return NextResponse.json({ allowed: true });
  }

  // Block all other Indian states
  return NextResponse.json({ allowed: false });
}
