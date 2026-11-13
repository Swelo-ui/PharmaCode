import { NextResponse } from 'next/server';
import { getWebsiteConfigAsync } from '@/lib/admin-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  const config = await getWebsiteConfigAsync();
  const res = NextResponse.json({
    success: true,
    config: {
      announcement: config.announcement,
      maintenanceMode: config.maintenanceMode,
      maintenanceMessage: config.maintenanceMessage,
      supportWhatsApp: config.supportWhatsApp,
      supportEmail: config.supportEmail,
      vipPassPrice: config.vipPassPrice,
      vipPassOriginalPrice: config.vipPassOriginalPrice,
      discountPercentage: config.discountPercentage,
      updatedAt: config.updatedAt,
    },
  });

  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  return res;
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}
