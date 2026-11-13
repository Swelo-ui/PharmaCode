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

// Public heartbeat endpoint called anonymously by mobile app & web to track real active users
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const platform = body.platform || 'Android App';

    // Extract device/client identifier
    const clientIp =
      body.deviceId ||
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('x-real-ip') ||
      'anonymous-session';

    recordAppHeartbeat(clientIp, platform);

    const res = NextResponse.json({ success: true, timestamp: Date.now() });
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return res;
  } catch (_) {
    const res = NextResponse.json({ success: false });
    res.headers.set('Access-Control-Allow-Origin', '*');
    return res;
  }
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}
