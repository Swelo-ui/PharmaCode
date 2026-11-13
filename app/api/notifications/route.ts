import { NextResponse } from 'next/server';
import { getStoredNotifications } from '@/lib/admin-store';

export async function GET() {
  const notifications = getStoredNotifications();
  const res = NextResponse.json({
    success: true,
    notifications,
    total: notifications.length,
    updatedAt: new Date().toISOString(),
  });

  // Enable CORS so Flutter app can fetch directly
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  res.headers.set('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');

  return res;
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}
