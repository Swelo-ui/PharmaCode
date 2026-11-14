import { NextRequest, NextResponse } from 'next/server';
import { getStoredPdfsAsync, getWebsiteConfigAsync, incrementPdfDownload } from '@/lib/admin-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const subjectCode = searchParams.get('subjectCode');
  const unit = searchParams.get('unit');

  const [pdfs, config] = await Promise.all([
    getStoredPdfsAsync(),
    getWebsiteConfigAsync(),
  ]);

  let targetUrl: string | null = null;
  let targetId: string | null = null;

  // 1. Direct PDF Kit by ID (from /notes/ verified cards or Play Product ID)
  if (id) {
    const target = pdfs.find((p) => p.id === id || p.playProductId === id);
    if (target && target.url) {
      targetUrl = target.url;
      targetId = target.id;
    }
  }

  // 2. Syllabus Subject & Unit matching (from /syllabus/[sem]/[subject] unit buttons)
  if (!targetUrl && subjectCode) {
    const cleanCode = subjectCode.trim().toUpperCase();
    const linksMap = config.syllabusSubjectLinks || {};

    // Check specific unit link first
    if (unit) {
      const unitNumMatch = unit.match(/\d+/);
      const unitNum = unitNumMatch ? unitNumMatch[0] : '';
      
      const keyVariants = [
        `${cleanCode}_unit_${unitNum}`,
        `${cleanCode}_${unitNum}`,
        `${cleanCode}_unit${unitNum}`,
        `${cleanCode}_${unit.trim().toLowerCase().replace(/\s+/g, '_')}`,
        `${cleanCode}_${unit.trim()}`,
      ];

      for (const k of keyVariants) {
        if (linksMap[k] && linksMap[k].trim()) {
          targetUrl = linksMap[k].trim();
          break;
        }
      }
    }

    // Check subject-level link (e.g. "BP101T")
    if (!targetUrl && linksMap[cleanCode] && linksMap[cleanCode].trim()) {
      targetUrl = linksMap[cleanCode].trim();
    }

    // 3. Fallback to managed PDF kits library
    if (!targetUrl) {
      let matched = null;
      if (unit) {
        const cleanUnit = unit.toLowerCase();
        matched = pdfs.find(
          (p) =>
            p.subjectCode.toUpperCase() === cleanCode &&
            (p.unit.toLowerCase().includes(cleanUnit) || cleanUnit.includes(p.unit.toLowerCase()))
        );
      }
      if (!matched) {
        matched = pdfs.find((p) => p.subjectCode.toUpperCase() === cleanCode);
      }
      if (matched && matched.url) {
        targetUrl = matched.url;
        targetId = matched.id;
      }
    }

    // 4. Fallback to global master notes/drive URL
    if (!targetUrl && config.globalDownloadUrl && config.globalDownloadUrl.trim() !== '') {
      targetUrl = config.globalDownloadUrl.trim();
    }
  }

  // Record download metric
  if (targetId) {
    incrementPdfDownload(targetId);
  }

  // Handle destination redirection
  if (targetUrl) {
    // If Admin configured Ad-Interstitial mode:
    if (
      config.downloadMode === 'ad_interstitial' &&
      config.adInterstitialUrl &&
      config.adInterstitialUrl.trim()
    ) {
      const adBase = config.adInterstitialUrl.trim();
      const finalRedirect = adBase.includes('?')
        ? `${adBase}&url=${encodeURIComponent(targetUrl)}`
        : `${adBase}?url=${encodeURIComponent(targetUrl)}`;
      const res = NextResponse.redirect(finalRedirect, 302);
      res.headers.set('Access-Control-Allow-Origin', '*');
      return res;
    }

    const finalTarget = targetUrl.startsWith('http')
      ? targetUrl
      : new URL(targetUrl, req.url).toString();

    const response = NextResponse.redirect(finalTarget, 302);
    response.headers.set('Access-Control-Allow-Origin', '*');
    return response;
  }

  // Fallback to website free notes directory
  return NextResponse.redirect(new URL('/notes/', req.url), 302);
}

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}
