import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/admin-store';

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('pharmacode_admin_session')?.value;
  const isValid = verifySessionToken(sessionCookie);

  return NextResponse.json({
    authenticated: isValid,
  });
}
