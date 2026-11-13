import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  getWebsiteConfigAsync,
  updateWebsiteConfig,
} from '@/lib/admin-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  const sessionCookie = req.cookies.get('pharmacode_admin_session')?.value;
  if (!verifySessionToken(sessionCookie)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const config = await getWebsiteConfigAsync();
  return NextResponse.json({ success: true, config });
}

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get('pharmacode_admin_session')?.value;
  if (!verifySessionToken(sessionCookie)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateWebsiteConfig(body);
    return NextResponse.json({
      success: true,
      message: 'Website configuration updated & live!',
      config: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to update config' }, { status: 500 });
  }
}
