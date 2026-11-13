import { NextRequest, NextResponse } from 'next/server';
import { getStoredPdfs, incrementPdfDownload } from '@/lib/admin-store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.redirect(new URL('/notes/', req.url), 302);
  }

  // Increment download count dynamically in Admin analytics & store
  incrementPdfDownload(id);

  const pdfs = getStoredPdfs();
  const target = pdfs.find((p) => p.id === id);

  if (target && target.url) {
    const targetUrl = target.url.startsWith('http')
      ? target.url
      : new URL(target.url, req.url).toString();

    const response = NextResponse.redirect(targetUrl, 302);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }

  return NextResponse.redirect(new URL('/notes/', req.url), 302);
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}
