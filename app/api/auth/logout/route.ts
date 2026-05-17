import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

function stripCookieDomain(cookie: string): string {
  return cookie.replace(/;\s*[Dd]omain=[^;]*/g, '');
}

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get('cookie') ?? '';

  const backendRes = await fetch(`${BACKEND_URL}/api/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: cookieHeader,
    },
  });

  const data = await backendRes.json().catch(() => ({}));
  const response = NextResponse.json(data, { status: backendRes.status });

  backendRes.headers.getSetCookie().forEach((cookie) => {
    response.headers.append('Set-Cookie', stripCookieDomain(cookie));
  });

  return response;
}
