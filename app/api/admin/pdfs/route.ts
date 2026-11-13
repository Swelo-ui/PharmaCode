import { NextRequest, NextResponse } from 'next/server';
import {
  verifySessionToken,
  getStoredPdfsAsync,
  savePdf,
  deletePdf,
} from '@/lib/admin-store';

export async function GET() {
  const pdfs = await getStoredPdfsAsync();
  return NextResponse.json({
    success: true,
    pdfs,
    total: pdfs.length,
  });
}

export async function POST(req: NextRequest) {
  const sessionCookie = req.cookies.get('pharmacode_admin_session')?.value;
  if (!verifySessionToken(sessionCookie)) {
    return NextResponse.json({ error: 'Unauthorized: Admin session required.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, subjectCode, subjectName, semester, unit, category, url, fileSize, pages } = body;

    if (!title || !subjectCode || !url) {
      return NextResponse.json(
        { error: 'Title, Subject Code, and Download URL are required.' },
        { status: 400 }
      );
    }

    const saved = await savePdf({
      title: title.trim(),
      subjectCode: subjectCode.trim().toUpperCase(),
      subjectName: (subjectName || subjectCode).trim(),
      semester: Number(semester) || 1,
      unit: unit ? unit.trim() : 'Complete Subject',
      category: category || 'Notes',
      url: url.trim(),
      fileSize: fileSize ? fileSize.trim() : '3.5 MB',
      pages: Number(pages) || 20,
    });

    return NextResponse.json({
      success: true,
      message: 'Study PDF added and published successfully!',
      pdf: saved,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const sessionCookie = req.cookies.get('pharmacode_admin_session')?.value;
  if (!verifySessionToken(sessionCookie)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID parameter required.' }, { status: 400 });
  }

  const deleted = await deletePdf(id);
  return NextResponse.json({ success: deleted });
}

export async function PATCH(req: NextRequest) {
  const sessionCookie = req.cookies.get('pharmacode_admin_session')?.value;
  if (!verifySessionToken(sessionCookie)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: 'PDF ID is required for update.' }, { status: 400 });
    }

    const { updatePdf } = await import('@/lib/admin-store');
    const updated = await updatePdf(id, updates);
    if (!updated) {
      return NextResponse.json({ error: 'PDF not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'PDF updated successfully!',
      pdf: updated,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Server error.' }, { status: 500 });
  }
}
