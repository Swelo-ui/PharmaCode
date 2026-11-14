import { NextRequest, NextResponse } from 'next/server';
import { getUserEntitlements } from '@/lib/admin-store';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'User ID is required to fetch entitlements.' },
        { status: 400 }
      );
    }

    const entitlements = await getUserEntitlements(userId.trim(), email || undefined);
    const productIds = entitlements.map((e) => e.productId);

    return NextResponse.json({
      success: true,
      userId: userId.trim(),
      email: email || null,
      productIds,
      entitlements,
      totalUnlocked: productIds.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch entitlements.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId;
    const email = body.email;

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'User ID is required.' },
        { status: 400 }
      );
    }

    const entitlements = await getUserEntitlements(userId.trim(), email || undefined);
    const productIds = entitlements.map((e) => e.productId);

    return NextResponse.json({
      success: true,
      userId: userId.trim(),
      email: email || null,
      productIds,
      entitlements,
      totalUnlocked: productIds.length,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch entitlements.' },
      { status: 500 }
    );
  }
}
