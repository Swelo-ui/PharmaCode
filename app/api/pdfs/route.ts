import { NextResponse } from 'next/server';
import { getStoredPdfs } from '@/lib/admin-store';

export async function GET() {
  const pdfs = getStoredPdfs();
  const res = NextResponse.json({
    success: true,
    pdfs,
    total: pdfs.length,
    updatedAt: new Date().toISOString(),
  });

  // Enable CORS for Flutter mobile app
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Pragma, Cache-Control');
  
  // Real-time updates without stale caching
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.headers.set('Pragma', 'no-cache');
  res.headers.set('Expires', '0');

  return res;
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Pragma, Cache-Control');
  return res;
}
