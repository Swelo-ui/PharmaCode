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

  // Enable CORS so Flutter app and external clients can fetch directly
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Pragma, Cache-Control');
  
  // Strict no-cache so broadcasts are received INSTANTLY with 0ms CDN lag
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.headers.set('Pragma', 'no-cache');
  res.headers.set('Expires', '0');
  res.headers.set('Surrogate-Control', 'no-store');

  return res;
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Pragma, Cache-Control');
  return res;
}
