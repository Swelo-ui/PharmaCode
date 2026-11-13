import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  getAnalytics,
  recordAppHeartbeat,
} from '@/lib/admin-store';

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('pharmacode_admin_session')?.value;
  if (!verifySessionToken(sessionCookie)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const analytics = getAnalytics();
  return NextResponse.json({
    success: true,
    analytics,
  });
}

// Public heartbeat endpoint called anonymously by app/web to track active users
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const platform = body.platform || 'Android App';
    recordAppHeartbeat(platform);
    return NextResponse.json({ success: true, timestamp: Date.now() });
  } catch (_) {
    return NextResponse.json({ success: false });
  }
}
