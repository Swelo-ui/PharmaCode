import { NextRequest, NextResponse } from 'next/server';
import { getStoredPdfsAsync, incrementPdfDownload } from '@/lib/admin-store';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const subjectCode = searchParams.get('subjectCode');
  const unit = searchParams.get('unit');

  const pdfs = await getStoredPdfsAsync();
  let target = id ? pdfs.find((p) => p.id === id) : null;

  if (!target && subjectCode) {
    const cleanCode = subjectCode.trim().toUpperCase();
    if (unit) {
      const cleanUnit = unit.toLowerCase();
      target = pdfs.find(
        (p) =>
          p.subjectCode.toUpperCase() === cleanCode &&
          (p.unit.toLowerCase().includes(cleanUnit) || cleanUnit.includes(p.unit.toLowerCase()))
      );
    }
    if (!target) {
      target = pdfs.find((p) => p.subjectCode.toUpperCase() === cleanCode);
    }
  }

  if (target && target.url) {
    incrementPdfDownload(target.id);
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
