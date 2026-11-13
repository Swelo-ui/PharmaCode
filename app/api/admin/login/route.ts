import { NextRequest, NextResponse } from 'next/server';
import {
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
  verifyAdminPassword,
  createSessionToken,
} from '@/lib/admin-store';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1';

  // 1. Check rate limit
  const rateLimitStatus = checkRateLimit(ip);
  if (!rateLimitStatus.allowed) {
    const remainingMins = Math.ceil((rateLimitStatus.remainingMs || 60000) / 60000);
    return NextResponse.json(
      {
        error: `Security Lockout: Too many failed attempts. Please try again after ${remainingMins} minute(s).`,
      },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { password } = body;

    // 2. Validate password
    const isValid = verifyAdminPassword(password);
    if (!isValid) {
      const { locked, attemptsLeft } = recordFailedAttempt(ip);
      if (locked) {
        return NextResponse.json(
          {
            error: 'Security Lockout: Maximum attempts exceeded. Access locked for 15 minutes.',
          },
          { status: 429 }
        );
      }
      return NextResponse.json(
        {
          error: `Invalid access password. ${attemptsLeft} attempt(s) remaining.`,
        },
        { status: 401 }
      );
    }

    // 3. Success: Reset rate limit and issue secure session token
    resetRateLimit(ip);
    const token = createSessionToken();

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful. Welcome to PharmaCode Admin Console.',
    });

    // Set secure HTTP-only cookie
    response.cookies.set('pharmacode_admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }
}
